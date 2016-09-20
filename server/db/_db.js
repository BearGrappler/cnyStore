'use strict';

var path = require('path');
var Sequelize = require('sequelize');

var env = require(path.join(__dirname, '../env'));
var db = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  logging: env.LOGGING,
  native: env.NATIVE,
  dialect: env.DATABASE_DIALECT,
  port: env.DATABASE_PORT
});

module.exports = db;
