'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const User = require('../../../db').model('User');
var Promise = require('bluebird');
var crypto = require('crypto');

router.get('/me', (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    else return res.send(req.user.sanitize());
});


router.put('/makeAdmin', function(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }

    User.findById(req.body.id)
    .then(function(user){
        if (!user) return;
        return user.update({
            isAdmin: true,
        })
    })
    .then(function(){
        res.sendStatus(204);
    })
})


//http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
//resetting pw
router.post('/forgot', function(req, res, next){

    console.log('you hit the forgot route', req.body)


    Promise.resolve(function(done){
         crypto.randomBytes(20, function(err, buf) {
            if(err){console.log(err)}
            var token = buf.toString('hex');
            return done(null, token);
        });
    })
    .then(function(res){
        console.log('we got past crypto step')
        console.log('heres the response', res)

        return User.findOne({ email: req.body.email }, function(err, user) {
            if(err){console.log('We got an error', err)}
            if (!user) {
              return res.sendStatus(401).redirect('/forgot');
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
              done(err, token, user);
            });
        });
    })
    .catch(done(err))
    // async.waterfall([
    // ,
    //     function(token, done) {
    //       User.findOne({ email: req.body.email }, function(err, user) {
    //         if(err){console.log('We got an error', err)}
    //         if (!user) {
    //           return res.sendStatus(401).redirect('/forgot');
    //         }

    //         user.resetPasswordToken = token;
    //         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    //         user.save(function(err) {
    //           done(err, token, user);
    //         });
    //       });
    //     },
    //     function(token, user, done) {

    //       var smtpTransport = nodemailer.createTransport('SMTP', {
    //         service: 'SendGrid',
    //         auth: {
    //           user: 'cnyStore',
    //           pass: 'cnyStore1'
    //         }
    //       });
    //       var mailOptions = {
    //         to: user.email,
    //         from: 'passwordreset@demo.com',
    //         subject: 'Node.js Password Reset',
    //         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    //           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    //           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
    //           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    //       };
    //       smtpTransport.sendMail(mailOptions, function(err) {
    //         console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
    //         done(err, 'done');
    //       });
    //     }
    //   ], function(err) {
    //         if (err) return next(err);
    //         res.redirect('/forgot');
    //   });
});

//link in reset email pw route
// router.get('/reset/:token', function(req, res) {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//     if (!user) {
//       req.flash('error', 'Password reset token is invalid or has expired.');
//       return res.redirect('/forgot');
//     }
//     res.render('reset', {
//       user: req.user
//     });
//   });
// });


router.delete('/deleteUser/:id', function(req, res, next) {

    if (!req.user || !req.user.isAdmin) {
        return res.sendStatus(401);
    }

    User.findById(req.params.id)
    .then(function(user){
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
