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
    formFactor: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
    },
    persona: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
    },
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
        },
        makePrimary: function() {
            return db.model('Cart')
                .update({ active: false }, { where: { UserId: this.UserId, id: { $ne: this.id } } })
                .catch(console.log);
        }
    },
    hooks: {
        afterUpdate: (cart) => cart.makePrimary(),
        afterCreate: (cart) => cart.makePrimary()
    }
});
