'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Cart', {

	//Current question node and filter scalars
    node: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    computer: Sequelize.INTEGER,
    type: Sequelize.STRING,
    price: Sequelize.INTEGER,
    priority: Sequelize.INTEGER,
    processor: Sequelize.INTEGER,
    ram: Sequelize.INTEGER,
    hdd: Sequelize.INTEGER

});
