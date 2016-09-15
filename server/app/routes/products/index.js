let router = require('express').Router(); // eslint-disable-line new-cap
let Product = require('../../../db').model('Product')
let Option = require('../../../db').model('Option')

router.get('/:id', function(req, res, next) {
  Product.findOne({where: {id: req.params.id}})
  .then(product => res.send(product))
});

router.get('/:id/upgrades', function(req, res, next) {
  Option.findAll({where: {baseId: req.params.id}, include: {model: Product, as: 'Upgrades'}})
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

router.put('/:id', function(req, res, next) {
  //need admin authentication check
  //NEED TO SANITIZE
  Product.findOne({where: {id: req.params.id}})
  .then(product => product.update(req.body))
  .then(product => res.send(product))
});

router.delete('/:id', function(req, res, next) {
  Product.findOne({where: {id: req.params.id}})
  .then(product => product.destroy())
  .then(() => res.sendStatus(204))
});

module.exports = router;
