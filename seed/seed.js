'use strict';

const chalk = require('chalk');
const db = require('../server/db');
const Promise = require('sequelize').Promise;

let seedUsers = function() {

    let users = require('./seedUsers.js')

    let creatingUsers = users.map(userObj => db.model('User').create(userObj))

    return Promise.all(creatingUsers);
};

let seedOrders = function() {
    let orders = require('./seedOrders');

    let creatingOrders = orders.map(orderObj => db.model('Order').create(orderObj))

    return Promise.all(creatingOrders)
}

let seedBilling = function() {
    let Billings = require('./seedBilling');

    let creatingBillings = Billings.map(billingObj => db.model('Billing').create(billingObj))

    return Promise.all(creatingBillings)
}

let seedShipping = function() {
    let Shippings = require('./seedShipping');

    let creatingShippings = Shippings.map(shippingObj => db.model('Shipping').create(shippingObj))

    return Promise.all(creatingShippings)
}


let seedProducts = function() {
    let products = require('./seedProducts');

    let creatingProducts = products.map(productObj => db.model('Product').create(productObj))

    return Promise.all(creatingProducts)
}

let seedAddresses = function() {
    let addresses = require('./seedAddresses');

    let creatingAddresses = addresses.map(addressObj => db.model('Address').create(addressObj))

    return Promise.all(creatingAddresses)
}

let seedOptions = function() {
    let options = require('./seedOptions');

    let creatingOptions = options.map(optionObj => db.model('Option').create(optionObj))

    return Promise.all(creatingOptions)
}

let seedReviews = function() {
    let reviews = require('./seedReviews');

    let creatingReviews = reviews.map(reviewObj => db.model('Review').create(reviewObj))

    return Promise.all(creatingReviews)
}


module.exports = (function() {

    return db.sync({ force: true })
        .then(function() {
            return seedUsers();
        })
        .then(() => {
            return seedOrders();
        })
        .then(() => {
            return seedAddresses();
        })
        .then(() => {
            return seedBilling();
        })
        .then(() => {
            return seedShipping();
        })
        .then(() => {
            return seedProducts();
        })
        .then(() => {
            return seedReviews();
        })
        .then(() => {
            return seedOptions();
        })
        .then(function() {
            return console.log(chalk.green('Seed successful!'));
        })
        .catch(function(err) {
            console.error(err);
            process.exit(1);
        });
}());
