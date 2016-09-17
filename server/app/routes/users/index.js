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

router.get('/findUsers', function(req, res, next){

    if (!req.user || !req.user.isAdmin){
        return res.sendStatus(401);
    }

    User.findAll()
        .then(users => {
            var sanitizedUsers = users.map(user => user.sanitize())
             res.send(sanitizedUsers);
        })
        .catch(err => next(err));
})


module.exports = router;
