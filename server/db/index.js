'use strict';
const db = require('./_db');

const User = require('./models/user');
const Address = require('./models/address');
const Option = require('./models/option');
const Order = require('./models/order');
const Product = require('./models/product');
const Review = require('./models/reviews');
const Cart = require('./models/cart');

User.Billing = User.belongsToMany(Address, { through: 'Billing', as: 'BillingAddresses' });
Address.Billing = Address.belongsToMany(User, { through: 'Billing', as: 'Purchasers' });

User.Shipping = User.belongsToMany(Address, { through: 'Shipping', as: 'ShippingAddresses' });
Address.Shipping = Address.belongsToMany(User, { through: 'Shipping', as: 'Residents' });

User.Review = User.hasMany(Review, { as: 'Reviews' });

User.Cart = User.hasMany(Cart, { as: 'Carts' });

User.Order = User.hasMany(Order, { as: 'Purchases' });

Product.Cart = Product.belongsToMany(Cart, { through: 'ProductCart', as: 'Carts' });
Cart.Product = Cart.belongsToMany(Product, { through: 'ProductCart', as: 'Items' });

Product.Review = Product.hasMany(Review, { as: 'Reviews' });

Product.Order = Product.belongsToMany(Order, { through: 'OrderProduct' });
Order.Product = Order.belongsToMany(Product, { through: 'OrderProduct' });

Option.Base = Option.belongsTo(Product, { as: 'BaseModels', foreignKey: 'baseId' });
Option.Upgrade = Option.belongsTo(Product, { as: 'Upgrades', foreignKey: 'upgradeId' });

Address.Order = Address.hasMany(Order, { as: 'Receipts' });

module.exports = db;
