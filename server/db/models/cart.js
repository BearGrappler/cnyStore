'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Cart', {

    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    //Current question node and filter scalars
    nodeId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    computer: Sequelize.ARRAY(Sequelize.STRING),
    type: Sequelize.ARRAY(Sequelize.STRING),
    cpu: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    gpu: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    ram: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    hdd: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    size: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }

}, {
    instanceMethods: {
        /**
         * Creates an Order instance, associates all cart items to it, and deletes the cart.
         * @return {[Promise]}
         */
        purchase: function() {
            let lineItems;
            return this.getItems()
                .then(items => {
                    lineItems = items;
                    return db.model('Order').create();
                })
                .then(newOrder => newOrder.addProducts(lineItems))
                .then(() => this.destroy())
                .catch(console.log);
        }
    },
    hooks: {
        afterUpdate: function(cart) {
            return db.model('Cart').update({ active: false }, { where: { UserId: cart.UserId, id: { $ne: cart.id } } });
        },
        afterCreate: function(cart) {
            return db.model('Cart').update({ active: false }, { where: { UserId: cart.UserId, id: { $ne: cart.id } } });
        }
    }
});
