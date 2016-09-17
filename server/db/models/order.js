'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Order', {
    paymentReceivedDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    shippingDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deliveryDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    currentStatus: {
        type: Sequelize.ENUM('processing', 'shipped', 'delivered'), // eslint-disable-line new-cap
        defaultValue: 'processing',
        allowNull: false
    }
});
