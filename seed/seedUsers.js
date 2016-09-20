var chance = require('chance')(123);

var numUsers = 10;
var emails = chance.unique(chance.email, numUsers);

//generate a single random user obj
function randUser() {
    var gender = chance.gender();
    return {
        name: [chance.first({ gender: gender }), chance.last()].join(' '),
        email: emails.pop(),
        password: chance.word(),
        isAdmin: chance.weighted([true, false], [5, 95])
    };
}

//create array of 100 users: 2 known, 98 random
var buildUsers = function() {

    //2 known users
    var users = [{
        name: 'John Doe',
        email: 'testing@fsa.com',
        password: 'password',
        isAdmin: true
    }, {
        name: 'Yi Chao',
        email: 'changingtimes@gmail.com',
        password: '123456',
        isAdmin: true
    }];

    //98 random users
    for (var i = 0; i < numUsers; i++) {
        users.push(randUser())
    }

    return users
}

module.exports = (function() {
    return buildUsers()
}());
