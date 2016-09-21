// Instantiate all models
const expect = require('chai').expect;
const Sequelize = require('sequelize');
const db = require('../../../server/db');
const supertest = require('supertest');

describe('Product Route', function() {

  let app, Product, Option;
  const productArray = require('../../../seed/seedProducts')
  const optionArray = require('../../../seed/seedOptions')

  before('Create app', function() {
    app = require('../../../server/app')(db);
  });

  beforeEach('Sync DB', function() {
    return db.sync({ force: true })
      .then(() => db.model('User').create({ email: 'testing@fsa.com', password: 'password', name: 'admin', isAdmin: 'true' }))
      .then(function() {
        Product = db.model('Product');
        return Promise.all(productArray.map(product => Product.create(product)))
      })
      .then(function() {
        Option = db.model('Option');
        return Promise.all(optionArray.map(option => Option.create(option)))
      })
  });

  describe('GET /', function() {
    let guestAgent;

    beforeEach('Create guest agent', function() {
      guestAgent = supertest.agent(app);
    });


    describe('Plain Request', function() {

      it('should get a 200 response', function(done) {
        guestAgent.get('/api/products/')
          .expect(200, done);
      });

      it('should get all products', function(done) {
        guestAgent.get('/api/products/')
          .expect(function(res) {
            if (res.body.length !== productArray.filter(product => product.type === 'base' ? true : false).length) throw new Error('Wrong number of products retrieved')
          })
          .expect(200, done)
      });
    });
    describe('get by id', function() {
      it('should get a 200 response', function(done) {
        guestAgent.get('/api/products/1')
          .expect(200, done);
      });

      it('should get the correct product', function(done) {
        guestAgent.get('/api/products/1')
          .expect(function(res) {
            if (res.body.name !== productArray[0].name) throw new Error('wrong product')
          })
          .expect(200, done);
      });

    })



  });

  describe('admin PUT / and DELETE /', function() {
    var adminAgent;

    var userInfo = {
      email: 'testing@fsa.com',
      password: 'password'
    };

    beforeEach('Create loggedIn user agent and authenticate', function(done) {
      adminAgent = supertest.agent(app);
      adminAgent.post('/login').send(userInfo).end(done);
    });

    it('can update a product', function(done) {
      adminAgent.put('/api/products/1').send(productArray[1])
        .expect(function(res) {
          if (res.body.name !== productArray[1].name) throw new Error('does not update product')
        })
        .expect(200, done)
    })

    // it('can delete a product', function(done) {
    //   adminAgent.delete('/api/products/1')
    //   .expect(adminAgent.get('/api/products/1').expect(res => {console.log('res.body', res.body)}))
    //   .expect(204, done)
    // })
  })

  describe('GET / upgrades', function() {
    let guestAgent;

    beforeEach('Create guest agent', function() {
      guestAgent = supertest.agent(app);
    });

    it('returns the options for a given product', function(done) {
      guestAgent.get('/api/products/1/upgrades')
      .expect(function(res) {
        if (res.body.length !== optionArray.filter(option => option.baseId === 1 ? true : false).length) throw new Error('wrong number of options returned')
      })
      .expect(200, done)
    })

  })

  describe('GET / search', function() {
    let guestAgent;

    beforeEach('Create guest agent', function() {
      guestAgent = supertest.agent(app);
    });

    it('can search by key term', function(done) {
      guestAgent.get('/api/products?search=macbook')
      .expect(function(res) {
        if (res.body.length !== 1) throw new Error('wrong number of products returned')
        if (res.body[0].name !== 'Macbook Silver') throw new Error('wrong product returned from search')
      })
      .expect(200, done)
    })
  })
});
