'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Cart = require('../../../db').model('Cart');

router.get('/', (req, res, next) => {
    req.user.getCarts()
        .then(carts => {
            if (!carts.length) {
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
            .then(cart => res.send(cart))
            .catch(next);
    }
});

router.put('/:id', (req, res, next) => {
    Cart.update({ active: true }, { where: { id: req.params.id } })
        .then(cart => {
            if (!cart) {
                return res.sendStatus(404);
            } else {
                if (req.user.id !== cart.UserId) return res.sendStatus(401);
                return res.send(cart);
            }
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    Cart.destroy({ where: { id: req.params.id, UserId: req.user.id } })
        .then(() => res.sendStatus(200))
        .catch(next);
});

router.use((req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        Cart.findOne({
                where: {
                    UserId: req.user.id,
                    status: 'active'
                }
            })
            .then(cart => {
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

router.get('/active', (req, res, next) => res.send(req.cart));

router.post('/active/:id', (req, res, next) => {
    req.cart.addItem(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(next);
});

router.delete('/active/:id', (req, res, next) => {
    req.cart.removeItem(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(next);

});

module.exports = router;
