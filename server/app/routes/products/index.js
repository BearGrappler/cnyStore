let router = require('express').Router(); // eslint-disable-line new-cap
let Product = require('../../../db').model('Product')
let Option = require('../../../db').model('Option')

router.get('/:id', function(req, res, next) {
  Product.findOne({where: {id: req.params.id}})
  .then(product => res.send(product))
});

router.get('/:id/upgrades', function(req, res, next) {
  return Option.findAll({where: {baseId: req.params.id}, include: {model: Product, as: 'Upgrades'}})
  .then(options => {
    options.forEach(option => {
      if (option.defOption) {
        option.Upgrades.dataValues.defOption = true;
        console.log(option.Upgrades)
      }
    })
    return options;
  })
  .then(options => res.send(options));
});

module.exports = router;
