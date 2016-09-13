/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var Order = db.model('order');
var Promise = require('sequelize').Promise;

var seedOrders = function () {

    var orders = [
        {
            paymentReceivedDate: '2016-04-02',
            shippingDate: '2016-04-03',
            deliveryDate: '2016-04-06',
            currentStatus: 'delivered'
        },
        {
            paymentReceivedDate: '2016-04-02',
            shippingDate: '2016-04-03',
            deliveryDate: null,
            currentStatus: 'shipped'
        },
        {
            paymentReceivedDate: '2016-04-02',
            shippingDate: null,
            deliveryDate: null,
            currentStatus: 'processing'
        }
    ];

    var creatingOrders = orders.map(function (orderObj) {
        return Order.create(orderObj);
    });

    return Promise.all(creatingOrders);

};

db.sync({ force: true })
    .then(function () {
        return seedOrders();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
