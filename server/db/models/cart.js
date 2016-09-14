'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Cart', {

	//Current question node and filter scalars
    node: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    computer: Sequelize.ARRAY(Sequelize.STRING),
    type: Sequelize.ARRAY(Sequelize.STRING),
    price: Sequelize.ARRAY(Sequelize.INTEGER),
    priority: Sequelize.ARRAY(Sequelize.STRING),
    processor: Sequelize.ARRAY(Sequelize.INTEGER),
    ram: Sequelize.ARRAY(Sequelize.INTEGER),
    hdd: Sequelize.ARRAY(Sequelize.INTEGER)

});
