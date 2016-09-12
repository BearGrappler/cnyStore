'use strict';
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('order', {
  purchaseDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  paymentDate: {
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
  paymentReceived: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  currentStatus: {
    type: Sequelize.ENUM('processing', 'shipped', 'delivered'),
    defaultValue: 'processing',
    allowNull: false
  }
});
