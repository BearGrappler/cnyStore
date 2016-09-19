'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const User = require('../../../db').model('User');

router.get('/me', (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    else return res.send(req.user.sanitize());
});


router.put('/makeAdmin', function(req, res, next) {

    console.log('you hit api/users/makeAdmin');
    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }

    User.findById(req.body.id)
    .then(function(user){
        console.log('heres user we searched for')
        if (!user) return;
        return user.update({
            isAdmin: true,
        })
    })
    .then(function(){
        res.sendStatus(204);
    })
})

router.delete('/deleteUser/:id', function(req, res, next) {
    console.log('you hit api/users/deleteUser');
    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }
    console.log('heres req.body ', req.params.id )

    User.findById(req.params.id)
    .then(function(user){
        console.log('heres user we searched for', user)
        if (!user) return;
        return user.destroy()
    })
    .then(function(){
        res.sendStatus(204);
    })
})


router.get('/:id', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        return res.send(req.user.sanitize());
    }
});

router.get('/', function(req, res, next) {

    console.log('you hit api/users/findUsers');
    if (!req.user || !req.user.isAdmin) {
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
