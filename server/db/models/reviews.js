var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('review', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    writtenReview: {
        type: Sequelize.STRING(500),
        allowNull: false,
        validate:{
            len: [20, 500]  //to satisfy validatio requirement that the review has to have a minimum length
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dateWritten: {
        type: Sequelize.DATE,
        validate: {
            isDate: true
        }
    }
}
);
