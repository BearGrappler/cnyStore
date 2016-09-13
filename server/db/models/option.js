'use strict';
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('option', {

    // Base model Product ID - will need to be a foreign key
    baseId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    // Upgrade option type 
    type: {
        type: Sequelize.ENUM('cpu, ram', 'hdd', 'gpu'),
        allowNull: false
    },

    // Is this the base model's default hardware
    defOption: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    // The option is recommended for the Gamer user type
    recGamer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    // The option is recommended for the Artist user type
    recArtist: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    // The option is recommended for the Student user type
    recStudent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    // The option is recommended for the Business user type
    recBusiness: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    // The option is recommended for the Casual user type
    recCasual: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }

}, {
    instanceMethods: {
        /**
         * Sets the instance as the Base model's default option by setting all other components' defOption of the same type/baseId to false
         * returns {Promise} Returns a promise for an array of updated upgrade options for a particular base ID and component type
         */
        setDefault: function() {
            let self = this;
            return db.model('option').findAll({where: {
                baseId: self.baseId,
                type: self.type
            }}).then((baseOptions) => {
                return Promise.all(baseOptions.map((opt) => {
                    if (opt.id === self.id) return opt.update({defOption: true},{returning: true}).then(arr => arr[1]);
                    else return opt.update({defOption: false},{returning: true}).then(arr => arr[1]);
                }))
            });
        },

        /**
         * [setRecType adjusts whether the upgrade option is recommended for a particular user type]
         * @param {[string]} recType [A string descriptor of user type]
         * @param {[boolean]} value   [The desired boolean value for whether the option is recommended for the specified userType]
         */
        setRecType: function(recType, value) {
            let recAttr = 'rec' + recType;
            return this.update({recAttr: value}, {returning: true}).then(arr => arr[1]);
        }
    }
});