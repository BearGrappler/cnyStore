'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function(app, db) {

    const User = db.model('User');
    const strategyFn = require('./fn/loc-strat')(db);

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function(req, res, next) {

        let authCb = require('./fn/auth-cb')(req, res, next, db);

        if (req.user) {
            return res.sendStatus(400);
        } else {
            passport.authenticate('local', authCb)(req, res, next);
        }

    });

    app.post('/logout', function(req, res, next) {
        req.logOut();
        return res.redirect('/');
    })

    // '9/14/16' change by Yi
    //A Post /create route for creating user accounts
    app.post('/createUser', function(req, res, next) {

        let authCb = require('./fn/auth-cb')(req, res, next, db);

        User.findOrCreate({ where: { name: req.body.name, email: req.body.email, password: req.body.password } })
            .then(() => passport.authenticate('local', authCb)(req, res, next))
            .catch(function(err) { console.log('ERROR something went wrong trying to create a user', err) })
            //afterwards should redirect to login so that user does not have to log-in again?
    })

};
