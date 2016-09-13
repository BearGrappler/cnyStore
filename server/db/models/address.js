'use strict';
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('address', {
    // Country (always require, 2 character ISO code)
    country: {
        type: Sequelize.STRING(2),
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    // First Name
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Last Name
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Company
    organisation_name: {
        type: Sequelize.STRING
    },
    // State / Province / Region
    administrative_area: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    // County / District (Unused)
    sub_administrative_area: {
        type: Sequelize.STRING
    },
    // City / Town
    locality: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Dependent Locality (unused)
    dependent_locality: {
        type: Sequelize.STRING
    },
    // Zip Code / Postal Code
    postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            validZip: function(value) {
                return /(^[0-9]{5}(\-[0-9]{4}$)?)/.test(String(value));
            }
        },
        set: function(val) {
            this.setDataValue('postal_code', String(val));
        }
    },
    // Street Address
    thoroughfare: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Apartment, Suite, Box number, etc.
    premise: {
        type: Sequelize.STRING
    },
    // Sub premise (unused)
    sub_premise: {
        type: Sequelize.STRING
    }

}, {
    getterMethods: {
        full_name: function() {
            return this.first_name + ' ' + this.last_name;
        }
    },
    instanceMethods: {
        print: function() {
            return {fullName: this.full_name, address: this.thoroughfare, apt: this.premise, city: this.locality, state: this.administrative_area, zip: this.postal_code, country: this.country};
        }
    }
});
