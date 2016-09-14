var router = require('express').Router(); // eslint-disable-line new-cap
var Product = require('../../../db').model('Product')
var Option = require('../../../db').model('Option')

router.get('/:id', function(req, res, next) {
  return Product.findOne({where: {id: req.params.id}});
});

router.get('/:id/upgrades', function(req, res, next) {
  return Option.findAll({where: {baseId: req.params.id}});
});

module.exports = router;
