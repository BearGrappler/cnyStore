'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Cart = require('../../../db').model('Cart');

router.get('/', (req, res, next) => {

    (function() {
        if (req.user) {
            return req.user.getCarts({ scope: 'itemsInCart' });
        } else if (req.session.CartId) {
            return Cart.findOne({
                where: {
                    id: req.session.CartId,
                    active: true
                },
                include: [{
                    association: Cart.Product
                }]
            });
        } else {
            return res.sendStatus(400);
        }
    }())
    .then(carts => {
            if (!carts) {
                return res.sendStatus(404);
            } else {
                return res.send(carts);
            }
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        Cart.create()
            .then(newCart => {
                return req.user.addCart(newCart);
            })
            .then(user => res.send(user.sanitize()))
            .catch(next);
    }
});

router.put('/:id', (req, res, next) => {
    // console.log('AAAA');
    if (!req.user) {
        // console.log('BBBB');
        return res.sendStatus(401);
    } else {
        // console.log('CCCC');
        Cart.update({ active: true }, { where: { id: req.params.id, UserId: req.user.id }, returning: true })
            .then(cart => {
                // console.log('DDDD');
                if (!cart[0]) {
                    // console.log('EEEE');
                    return res.sendStatus(404);
                } else {
                    // console.log('FFFF');
                    console.log('cart', cart[1]);
                    console.log('req.user.id', req.user.id);
                    console.log('cart.UserId', cart[1].UserId);
                    if (String(req.user.id) !== String(cart[1][0].UserId)) return res.sendStatus(401);
                    // console.log('GGGG');
                    return res.send(cart);
                }
            })
            .catch(next);
    }
});

router.delete('/:id', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        Cart.destroy({ where: { id: req.params.id, UserId: req.user.id } })
            .then(() => res.sendStatus(204))
            .catch(next);
    }
});

router.use((req, res, next) => {
    // console.log('AAAA');
    (function() {
        // console.log('BBBB');
        if (req.user) {
            // console.log('UUUU');
            return Cart.findOne({
                where: {
                    UserId: req.user.id,
                    active: true
                },
                include: [{
                    association: Cart.Product
                }]
            });
        } else if (req.session.CartId) {
            // console.log('SSSS');
            return Cart.findOne({
                where: {
                    id: req.session.CartId,
                    active: true
                },
                include: [{
                    association: Cart.Product
                }]
            });
        } else {
            return res.sendStatus(400);
        }
    }())
    .then(cart => {
            if (!cart) {
                return res.sendStatus(404);
            } else {
                req.cart = cart;
                next();
            }
        })
        .catch(next);
});

router.get('/active', (req, res, next) => res.send(req.cart));

router.post('/active/:id', (req, res, next) => {

    req.cart.addItem(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(next);

});

router.delete('/active/:id', (req, res, next) => {

    req.cart.removeItem(req.params.id)
        .then((item) => {
            if (item) {
                return res.sendStatus(204);
            } else {
                return res.sendStatus(404);
            }
        })
        .catch(next);

});

module.exports = router;
