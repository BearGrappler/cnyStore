'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, db) {

    const User = db.model('User');
    const Cart = db.model('Cart');

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    let strategyFn = function(email, password, done) {
        User.findOne({
                where: {
                    email: email
                }
            })
            .then(function(user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            })
            .catch(done);
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function(req, res, next) {

        let authCb = function(err, user) {

            if (err) return next(err);

            if (!user) {
                let error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function(loginErr) {

                let sendRes = function(obj) {
                    res.status(200).send({
                        user: obj.sanitize()
                    });
                }

                if (loginErr) {
                    return next(loginErr);
                    // We respond with a response object that has user with _id and email.
                } else {
                    if (!req.session.hasOwnProperty('CartId')) return sendRes(user);
                    Cart.findOne({
                            where: {
                                id: req.session.CartId
                            },
                            include: [{ association: Cart.Product }]
                        }).then(cart => {
                            if (!cart) return sendRes(user);
                            if (!cart.Items.length) {
                                cart.destroy().then(() => {
                                    return sendRes(user);
                                })
                            } else {
                                return cart.update({ UserId: req.user.id });
                            }
                        })
                        .then(() => sendRes(user))
                        .catch(next)
                }
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });

    // '9/14/16' change by Yi
    //A Post /create route for creating user accounts
    app.post('/createUser', function(req, res, next) {

        let authCb = function(err, user) {

            if (err) return next(err);

            if (!user) {
                let error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function(loginErr) {
                if (loginErr) return next(loginErr);
                // We respond with a response object that has user with _id and email.
                res.status(200).send({
                    user: user.sanitize()
                });
            });

        };

        User.findOrCreate({ where: { name: req.body.name, email: req.body.email, password: req.body.password } })
            .then(() => passport.authenticate('local', authCb)(req, res, next))
            .catch(function(err) { console.log('ERROR something went wrong trying to create a user', err) })
            //afterwards should redirect to login so that user does not have to log-in again?
    })

};
