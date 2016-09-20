'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Option', {
  // Base model Product ID - will need to be a foreign key
  baseId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  // Upgrade option type
  type: {
    type: Sequelize.ENUM('cpu', 'ram', 'hdd', 'gpu'), // eslint-disable-line new-cap
    allowNull: false
  },

  // Is this the base model's default hardware
  defOption: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }

}, {
  instanceMethods: {
    /**
     * Sets the instance as the Base model's default option by setting all other components' defOption of the same type/baseId to false
     * returns {Promise} Returns a promise for an array of updated upgrade options for a particular base ID and component type
     */
    setDefault: function() {
      let self = this;
      return db.model('option').findAll({
        where: {
          baseId: self.baseId,
          type: self.type
        }
      }).then((baseOptions) => {
        return Promise.all(baseOptions.map((opt) => {
          if (opt.id === self.id) return opt.update({ defOption: true }, { returning: true }).then(arr => arr[1]);
          else return opt.update({ defOption: false }, { returning: true }).then(arr => arr[1]);
        }))
      });
    }
  }
});
