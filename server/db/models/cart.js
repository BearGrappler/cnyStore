'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Cart', {

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

});
