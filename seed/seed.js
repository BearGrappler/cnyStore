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

db.sync({ force: true })
    .then(function() {
        return seedUsers();
    })
    .then(() => {
        return seedOrders();
    })
    .then(() => {
        return seedProducts();
    })
    .then(() => {
        return seedAddresses();
    })
    .then(() => {
        return seedOptions();
    })
    .then(function() {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });
