'use strict';
// const chalk = require('chalk');

module.exports = function(app, db) {

    app.use((req, res, next) => {
        // console.log(chalk.yellow('req.user'), req.user);
        // console.log(chalk.red('req.session'), req.session);
        if (!req.user && !req.session.hasOwnProperty('CartId')) {
            db.model('Cart').create()
                .then(cart => {
                    // console.log(chalk.blue('new-cart'), cart);
                    if (cart) req.session.CartId = cart.id;
                    // console.log(chalk.blue('new-session'), req.session);
                    next();
                })
                .catch(next);
        } else {
            next();
        }
    });

};
