'use strict';
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('order', {
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
    type: Sequelize.ENUM('processing', 'shipped', 'delivered'),
    defaultValue: 'processing',
    allowNull: false
  }
});
