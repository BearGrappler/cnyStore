let router = require('express').Router(); // eslint-disable-line new-cap
let Product = require('../../../db').model('Product')
let Option = require('../../../db').model('Option')

router.get('/:id', function(req, res, next) {
  Product.findOne({where: {id: req.params.id}})
  .then(product => res.send(product))
});

router.get('/:id/upgrades', function(req, res, next) {
  return Option.findAll({where: {baseId: req.params.id}})
  .then(function(options) {
    let promiseArray = [];
    options.forEach(option => promiseArray.push(Product.findOne({where: {id: option.upgradeId}})))
    return Promise.all(promiseArray)
  })
  .then(options => res.send(options));
});

module.exports = router;
