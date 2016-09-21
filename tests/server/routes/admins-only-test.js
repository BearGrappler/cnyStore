// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Admins-Only Route', function () {

    var app, User;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        User = db.model('user');
    });

    describe('Unauthenticated request', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get a 401 response', function (done) {
            guestAgent.get('/api/admins-Only')
                .expect(401)
                .end(done);
        });

    });

    describe('Authenticated request', function () {

        var loggedInAdmin;

        var userInfo = {
            email: 'testing@fsa.com',
            password: 'password'
        };

        beforeEach('Create a user', function (done) {
            return User.create(userInfo).then(function (user) {
                done();
            }).catch(done);
        });

        beforeEach('Create loggedIn administrator agent and authenticate', function (done) {
            loggedInAdmin = supertest.agent(app);
            loggedInAdmin.post('/login').send(userInfo).end(done);
        });

        it('should get with 200 response', function (done) {
            loggedInAdmin.get('/api/admins-only').expect(200).end(done);
        });


        it('should grab a list of all the users', function (done) {
            loggedInAdmin.get('/api/users').expect(200).end(function(err, res){
                if(err)return done(err);
                expect(response.data).to.be.an('array');
                done();
            });
        });

    });

});
