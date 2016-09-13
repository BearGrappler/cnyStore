'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('OrderProduct', {
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
    recommended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});
