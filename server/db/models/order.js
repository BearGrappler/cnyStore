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
        type: Sequelize.ENUM('processing', 'shipped', 'delivered'),
        defaultValue: 'processing',
        allowNull: false
    }
}, {
    instanceMethods: {
        /**
         * Transfers the contents of a cart to an order and deletes the cart.
         * @param  {[Number]} id [Cart Id]
         * @return {[Promise]}    [Promise to transfer cart contents, destroy cart, return 'this']
         */
        transfer: function(id) {
            let cartToTransfer;
            db.model('Cart').findOne({ where: { id: id }, include: [{ association: db.model('Cart').Product }] })
                .then(cart => {
                    if (!cart) {
                        return;
                    } else {
                        cartToTransfer = cart;
                        return this.addProducts(cart.Items);
                    }
                })
                .then(() => cartToTransfer.destroy())
                .catch(console.log);
        }
    }
});
