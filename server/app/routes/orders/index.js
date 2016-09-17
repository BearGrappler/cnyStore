'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Order = require('../../../db').model('Order');
const Cart = require('../../../db').model('Cart');

router.param('id', (req, res, next, id) => {
    if (/[^0-9]/.test(String(id))) {
        return res.sendStatus(400);
    } else {
        next();
    }
});

router.get('/:id', (req, res, next) => {
    Order.findById(req.params.id).then(order => {
            if (!order) {
                return res.sendStatus(404);
            } else {
                res.send(order);
            }
        })
        .catch(next);
});

router.use((req, res, next) => {
    if (!(req.body.hasOwnProperty('CartId') && req.body.hasOwnProperty('AddressId'))) {
        return res.sendStatus(400);
    } else {
        if (!req.user) return res.sendStatus(401);
        Cart.findById(req.body.CartId).then(cart => {
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
                return res.sendStatus(500);
            } else {
                return res.send(order);
            }
        })
        .catch(next);
});

module.exports = router;
