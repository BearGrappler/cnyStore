var sinon = require('sinon');
var expect = require('chai').expect;
var Sequelize = require('sequelize');
var db = require('../../../server/db');

var Product = db.model('Product');

describe('Product model', function() {

  beforeEach('Sync DB', function() {
    return db.sync({ force: true });
  });

  var sampleProduct = {
    name: 'Macbook Silver',
    manufacturer: 'Apple',
    msrp: 800.00,
    price: 999.99,
    description: 'stylish laptop for college students',
    imageUrls: ['http://store.storeimages.cdn-apple.com/4973/as-images.apple.com/is/image/AppleInc/aos/published/images/m/ac/macbook/air/macbook-air-13-select-hero-201505?wid=265&hei=154&fmt=png-alpha&qlt=95&.v=YGXjP3', 'http://store.storeimages.cdn-apple.com/4973/as-images.apple.com/is/image/AppleInc/aos/published/images/m/ac/macbookair/select/macbookair-select-box-201504?wid=553&hei=399&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=HWal10'],
    type: 'base',
    userType: 'student'
  }

  var createProduct = function() {
    return Product.create(sampleProduct);
  }

  beforeEach(function() {
    return createProduct();
  });

  // afterEach(function() {});

  it('should find the right product values', function() {
    return Product.findOne({ where: { id: '1' }, attributes: Object.keys(sampleProduct) })
      .then(product => {
        expect(product.dataValues.name).to.be.equal(sampleProduct.name);
        expect(product.dataValues.manufacturer).to.be.equal(sampleProduct.manufacturer);
        expect(product.dataValues.description).to.be.equal(sampleProduct.description);
      })
  });

  it('should store the price and msrp in cents', function() {
    return Product.findOne({ where: { id: '1' }, attributes: Object.keys(sampleProduct) })
      .then(product => {
        expect(product.dataValues.price).to.be.equal(sampleProduct.price * 100);
        expect(product.dataValues.msrp).to.be.equal(sampleProduct.msrp * 100);
      })
  })

  it('should properly retrieve the price and msrp', function() {
    return Product.findOne({ where: { id: '1' }, attributes: Object.keys(sampleProduct) })
      .then(product => {
        expect(product.price).to.be.equal(sampleProduct.price)
        expect(product.msrp).to.be.equal(sampleProduct.msrp)
      })
  })

  it('can perform a search', function() {
    var searchTerm = '%mac%'
    return Product.findAll({ where: { $or: [{ name: { $iLike: searchTerm } }, { description: { $iLike: searchTerm } }, { manufacturer: { $iLike: searchTerm } }] } })
      .then(products => {
        expect(products).to.have.length(1)
      })
  })

  it('can retrieve multiple products', function() {
    return Product.create({ name: 'new product', manufacturer: 'new manufacturer', price: 1234, msrp: 4321, description: 'the new product', type: 'base', imageUrls: ['url'] })
    .then(() => Product.findAll())
    .then(products => {
      expect(products).to.have.length(2);
    })
  })

});
