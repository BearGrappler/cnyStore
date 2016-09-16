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
    hooks: {
        afterUpdate: function(cart) {
            db.model('Cart').findAll({ where: { UserId: cart.UserId, id: { $ne: cart.id } } }).then(carts => {
                if (!carts.length) {
                    return;
                } else {
                    return Promise.all(carts.map(oldCart => {
                        return oldCart.update({ active: false }, { returning: true })
                            .then(cart => cart ? cart : null)
                            .catch(console.log);
                    }));
                }
            })
        }
    }
});
