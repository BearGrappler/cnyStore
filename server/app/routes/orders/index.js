'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Order = require('../../../db').model('Order');
const Cart = require('../../../db').model('Cart');

router.use((req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        next();
    }
})

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

    console.log('you hit /api/orders/adminsOnly')
    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }

    Order.findById(req.params.orderId)
    .then(function(order){
        if(!order) return;
        return order.update({
            currentStatus: req.params.newStatus
        })
    })
    .catch(err => next(err));


})


router.get('/', (req, res, next) => {
    req.user.getPurchases({ scope: 'fullOrder' })
        .then(orders => {
            if (!orders.length) {
                return res.sendStatus(404);
            } else {
                res.send(orders);
            }
        })
        .catch(next);
});

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
        if (!req.user) return res.sendStatus(401);
        Cart.findOne({
                where: {
                    UserId: req.user.id,
                    active: true
                }
            }).then(cart => {
                if (!cart) {
                    return res.sendStatus(404);
                } else {
                    req.cart = cart;
                    next();
                }
            })
            .catch(next);
    }
});

router.post('/', (req, res, next) => {
    return req.cart.purchase(req.body.AddressId, req.user)
        .then(order => {
            if (!order) {
                return res.sendStatus(400);
            } else {
                return res.send(order);
            }
        })
        .catch(next);
});

module.exports = router;
