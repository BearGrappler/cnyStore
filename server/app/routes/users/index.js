const router = require('express').Router(); // eslint-disable-line new-cap
const User = require('../../../db').model('User')

router.get('/me', function(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    User.findOne({ where: { id: req.user.id } })
        .then(user => res.send(user.sanitize()));
});

router.get('/me/cart', function(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    User.findOne({ where: { id: req.user.id }, include: [{ association: User.Cart }] })
        .then(user => res.send(user.sanitize()));
});

// router.post('/me/cart', function(req, res, next) {
//     if (!req.user) return res.sendStatus(401);
// });

router.get('/one', function(req, res, next) {
    if (!req.user || !req.body.hasOwnProperty('id')) return res.sendStatus(401);
    User.findOne({ where: { id: +req.body.id } })
        .then(user => {
            if (!user) res.sendStatus(404);
            else res.send(user.sanitize());
        })
        .catch(err => next(err));
});

//router for admin to search for Users to set them as admin

router.get('/findUsers', function(req, res, next){

    if (!req.user || !req.user.isAdmin){
        return res.sendStatus(401);
    }

    console.log('you hit the req /api/findUsers' , req.data)

    User.findAll()
        .then(users => {
            var sanitizedUsers = users.map(user => user.sanitize())
             res.send(sanitizedUsers);
        })
        .catch(err => next(err));
})


module.exports = router;
