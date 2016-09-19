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
    },
    tax: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        allowNull: false,
        set: function(tax) {
            this.setDataValue('tax', tax * 100)
        },
        get: function() {
            var tax = this.getDataValue('tax');
            return tax / 100;
        }
    },
    amountPaid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        set: function(amountPaid) {
            this.setDataValue('amountPaid', amountPaid * 100)
        },
        get: function() {
            var amountPaid = this.getDataValue('amountPaid');
            return amountPaid / 100;
        }
    }
}, {
    getterMethods: {
        total: function() {
            return this.getProducts()
                .then(products => {
                    return products
                        .map(product => product.getDataValue('price'))
                        .reduce((sum, current) => sum + current * this.getDataValue('tax'), 0);
                })
        }
    }
});
