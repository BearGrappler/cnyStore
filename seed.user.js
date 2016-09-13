var chance = require('chance')(123);

var numUsers = 100;
var emails = chance.unique(chance.email, numUsers);

function randUser() {
  var gender = chance.gender();
  return {
    name: [chance.first({ gender: gender }), chance.last()].join(' '),
    email: emails.pop(),
    password: chance.word(),
    isAdmin: chance.weighted([true, false], [5, 95])
  };
}

var buildUsers = function() {

  var users = [{
    name: 'John Doe',
    email: 'testing@fsa.com',
    password: 'password',
    isAdmin: true
  }, {
    name: 'Barack Obama',
    email: 'obama@gmail.com',
    password: 'potus',
    isAdmin: true
  }];

  for (var i = 0; i < numUsers; i++) {
    users.push(randUser())
  }

  console.log(users)

  return users

}

module.exports = function() {
  return buildUsers()
}

buildUsers()
