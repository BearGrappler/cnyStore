'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Address', {
    // Country (always require, 2 character ISO code)
    country: {
        type: Sequelize.STRING(2), // eslint-disable-line new-cap
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    company: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zipCode: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            validZip: function(value) {
                return /(^[0-9]{5}(\-[0-9]{4}$)?)/.test(String(value));
            }
        },
        set: function(val) {
            this.setDataValue('zipCode', String(val));
        }
    },
    // Street Address
    thoroughfare: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Apartment, Suite, Box number, etc.
    apartment: {
        type: Sequelize.STRING
    }

}, {
    getterMethods: {
        fullName: function() {
            return this.firstName + ' ' + this.lastName;
        }
    }
});
