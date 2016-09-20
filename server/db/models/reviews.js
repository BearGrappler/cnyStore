'use strict';
const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('Review', {
    writtenReview: {
        type: Sequelize.STRING(3000), // eslint-disable-line new-cap
        allowNull: false,
        validate: {
            len: [0, 3000] //to satisfy validation requirement that the review has to have a minimum length
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            max: 5,
            min: 1
        }
    }
});
