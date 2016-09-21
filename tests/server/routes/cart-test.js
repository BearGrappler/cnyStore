// Instantiate all models
const expect = require('chai').expect;

const Sequelize = require('sequelize');

const db = require('../../../server/db');

const supertest = require('supertest');

describe('Cart Route', function() {

    let app, Cart;

    before('Create app', function() {
        app = require('../../../server/app')(db);
        Cart = db.model('Cart');
    });

    describe('GET /api/cart/', function() {


        describe('Unauthenticated request', function() {

            let guestAgent;

            beforeEach('Create guest agent', function() {
                guestAgent = supertest.agent(app);
            });

            it('should get a 200 response', function(done) {
                guestAgent.get('/api/cart/')
                    .expect(200, done);
            });

            it('should get a single cart', function(done) {
                guestAgent.get('/api/cart/')
                    .expect(function(res) {
                        if (res.body.Items.length !== 0) throw new Error('Why does it have items?');
                        if (res.body.id !== 14) throw new Error('Wrong ID!');
                    })
                    .expect(200, done);
            });

        });

        describe('Authenticated request', function() {

            var loggedInAgent;

            var userInfo = {
                email: 'testing@fsa.com',
                password: 'password'
            };

            beforeEach('Create loggedIn user agent and authenticate', function(done) {
                loggedInAgent = supertest.agent(app);
                loggedInAgent.post('/login').send(userInfo).end(done);
            });

            it('should get a 200 response and all carts', function(done) {
                loggedInAgent.get('/api/cart/')
                    .expect(function(res) {
                        if (res.body.length !== 1) throw new Error('Incorrect number of carts!');
                    })
                    .expect(200, done);
            });

        });

    });

    describe('POST /api/cart/', function() {

        beforeEach('Create app', function() {
            app = require('../../../server/app')(db);
            Cart = db.model('Cart');
        });

        describe('Unauthenticated request', function() {

            let guestAgent;

            beforeEach('Create guest agent', function() {
                guestAgent = supertest.agent(app);
            });

            it('should get a 401 response', function(done) {
                guestAgent.post('/api/cart/')
                    .expect(401, done);
            });

        });

        describe('Authenticated request', function() {

            var loggedInAgent;

            var userInfo = {
                email: 'testing@fsa.com',
                password: 'password'
            };

            beforeEach('Create loggedIn user agent and authenticate', function(done) {
                loggedInAgent = supertest.agent(app);
                loggedInAgent.post('/login').send(userInfo).end(done);
            });

            it('It should get a list of all its carts', function(done) {
                loggedInAgent
                    .post('/api/cart/')
                    .expect(function(res) {
                        if (res.body.length !== 2) throw new Error('Incorrect number of carts!');
                    })
                    .expect(200, done);
            });

        });

    });
});
