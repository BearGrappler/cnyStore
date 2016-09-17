'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');
const chalk = require('chalk');

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
        type: Sequelize.ARRAY(Sequelize.STRING), // eslint-disable-line new-cap
        defaultValue: []
    },
    persona: {
        type: Sequelize.ARRAY(Sequelize.STRING), // eslint-disable-line new-cap
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
        purchase: function(AddressId, user) {
            let order;
            return this.getItems()
                .then(items => {
                    if (!items.length) {
                        return;
                    } else {
                        return db.model('Order').create()
                            .then(newOrder => {
                                order = newOrder;
                                return order.addProducts(items)
                            })
                            .then(() => db.model('Address').findById(AddressId))
                            .then(address => address.addReceipt(order))
                            .then(() => user.addPurchase(order))
                            .then(() => this.destroy())
                            .then(() => order)
                            .catch(console.log);
                    }
                })
                .catch(console.log);

        }
    },
    hooks: {
        afterUpdate: function(cart) {
            return db.model('Cart')
                .update({ active: false }, { where: { UserId: cart.UserId, id: { $ne: cart.id } }, returning: true })
                .then(_cart => _cart)
                .catch(console.log);
        },
        afterCreate: function(cart) {
            return db.model('Cart')
                .update({ active: false }, { where: { UserId: cart.UserId, id: { $ne: cart.id } }, returning: true })
                .then(_cart => _cart)
                .catch(console.log);
        },
        beforeDestroy: function(cart) {
            let UserId = cart.UserId;
            return db.model('Cart')
                .findAll({ where: { UserId: UserId, id: { $ne: cart.id } } })
                .then(_carts => {
                    if (!_carts.length) {
                        return;
                    } else {
                        return _carts.sort((_a, _b) => {
                            return (_a.updatedAt > _b.updatedAt) ? -1 : 1;
                        })[0].update({ active: true }, { returning: true })
                    }
                })
                .then(_updatedCart => {
                    if (!_updatedCart) {
                        return db.model('Cart').create({ UserId: UserId })
                    } else {
                        return _updatedCart;
                    }
                })
                .then(newCart => newCart)
                .catch(console.log);
        }
    }
});
