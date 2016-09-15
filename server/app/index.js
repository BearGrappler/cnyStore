'use strict';
const path = require('path');
const express = require('express');
const app = express();
const Cart = require('../db').model('Cart')

module.exports = function(db) {

    // Pass our express application pipeline into the configuration
    // function located at server/app/configure/index.js
    require('./configure')(app, db);

    app.use(function(req, res, next) {
        if (!req.user && !req.session.hasOwnProperty('cart')) {
            Cart.create()
                .then(cart => {
                    if (cart) req.session.CartId = cart.id;
                    console.log('Made you a cart, buddy!', req.session);
                    next();
                })
                .catch(next);
        } else {
            console.log('Found your cart, buddy!', req.session);
            // console.log("Here's the req.user, buddy!", req.user);
            next();
        }
    });

    // Routes that will be accessed via AJAX should be prepended with
    // /api so they are isolated from our GET /* wildcard.
    app.use('/api', require('./routes'));


    /*
     This middleware will catch any URLs resembling a file extension
     for example: .js, .html, .css
     This allows for proper 404s instead of the wildcard '/*' catching
     URLs that bypass express.static because the given file does not exist.
     */
    app.use(function(req, res, next) {

        if (path.extname(req.path).length > 0) {
            res.status(404).end();
        } else {
            next(null);
        }

    });

    app.get('/*', function(req, res) {
        res.sendFile(app.get('indexHTMLPath'));
    });

    // Error catching endware.
    app.use(function(err, req, res, next) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500).send(err.message || 'Internal server error.');
    });

    return app;

};
