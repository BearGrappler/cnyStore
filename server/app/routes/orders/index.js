'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Order = require('../../../db').model('Order');

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

router.post('/', (req, res, next) => {
    if (!(req.body.hasOwnProperty('CartId') && req.body.hasOwnProperty('AddressId'))) {
        res.sendStatus(400);
    } else {
        let trackOrder;
        Order.create({ UserId: req.user.id, AddressId: req.body.AddressId })
            .then(order => {
                if (!order) {
                    return res.sendStatus(404);
                } else {
                    trackOrder = order;
                    return order.transfer(req.body.CartId);
                }
            })
            .then(() => {
                res.send(trackOrder);
            })
            .catch(next);
    }
});

module.exports = router;
