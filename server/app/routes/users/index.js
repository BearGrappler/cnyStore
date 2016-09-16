'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap

router.get('/me', (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    else return res.send(req.user.sanitize());
});

router.get('/:id', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        return res.send(req.user.sanitize());
    }
});

module.exports = router;
