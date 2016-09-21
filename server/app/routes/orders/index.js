'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Order = require('../../../db').model('Order');
const Cart = require('../../../db').model('Cart');

router.get('/', (req, res, next) => {

    if (!req.user) return res.send([]);

    req.user.getPurchases({ scope: 'fullOrder' })
        .then(orders => {
            if (!orders.length) {
                return res.send([]);
            } else {
                res.send(orders);
            }
        })
        .catch(next);
});

router.param('id', (req, res, next, id) => {
    if (/[^0-9]/.test(String(id))) {
        return res.sendStatus(400);
    } else {
        next();
    }
});

router.get('/adminsOnly/getAll', function(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }

    Order.findAll()
        .then(orders => {
            res.send(orders);
        })
        .catch(err => next(err));
})

router.put('/adminsOnly/:orderId/:newStatus', function(req, res, next) {

    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }

    Order.findById(req.params.orderId)
        .then(function(order) {
            if (!order) return;
            return order.update({
                currentStatus: req.params.newStatus
            })
        })
        .catch(err => next(err));


})

router.get('/:id', (req, res, next) => {
    Order.findOne({
            where: {
                UserId: req.user.id,
                id: req.params.id
            }
        }).then(order => {
            if (!order) {
                return res.sendStatus(404);
            } else {
                res.send(order);
            }
        })
        .catch(next);
});

router.use((req, res, next) => {

    if (!req.body.hasOwnProperty('AddressId')) {
        return res.sendStatus(400);
    } else {
        (function() {
            if (!req.user) {
                return Cart.findOne({ where: { id: req.session.CartId }, include: [{ association: Cart.Product }] });
            } else {
                return Cart.findOne({
                    where: {
                        UserId: req.user.id,
                        active: true
                    },
                    include: [{ association: Cart.Product }]
                });
            }
        }())
        .then(cart => {
                if (!cart) {
                    return res.sendStatus(404);
                } else {
                    req.cart = cart;
                    req.cart.total = req.cart.Items.reduce((_a, _b) => {
                        return _a + _b.price * 100;
                    }, 0)
                    next();
                }
            })
            .catch(next);
    }
});

router.post('/', (req, res, next) => {

    let pk = require('../../../env').STRIPE_PK;

    let Stripe = require('stripe')(pk);

    // Get the credit card details submitted by the form
    let token = req.body.stripeToken; // Using Express

    // Create a charge: this will charge the user's card
    Stripe.charges.create({
        amount: req.cart.total, // Amount in cents
        currency: 'usd',
        source: token.id,
        description: 'Brand New Laptop!'
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            return res.send(err);
        } else {
            if (!charge.paid) return res.sendStatus(400);
            req.cart.purchase(req.body.AddressId, req.user, charge.amount)
                .then(order => {
                    if (!order) {
                        return res.sendStatus(400);
                    } else {
                        return res.send(order);
                    }
                })
                .catch(next);
        }
    });
});

module.exports = router;
