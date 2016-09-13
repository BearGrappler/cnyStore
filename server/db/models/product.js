'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    manufacturer: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    msrp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        set: function(msrp) {
            this.setDataValue(msrp * 100)
        },
        get: function() {
            var msrp = this.getDataValue('msrp');
            return msrp / 100
        }
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        set: function(price) {
            this.setDataValue(price * 100)
        },
        get: function() {
            var price = this.getDataValue('price');
            return price / 100
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageUrls: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
    },
    type: {
        type: Sequelize.ENUM('base', 'ram', 'hdd', 'cpu', 'gpu'),
        allowNull: false
    },
    inventory: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
