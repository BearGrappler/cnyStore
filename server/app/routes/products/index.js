let router = require('express').Router(); // eslint-disable-line new-cap
let Product = require('../../../db').model('Product')
let Option = require('../../../db').model('Option')

router.get('/', function(req, res, next) {
  Product.findAll({ where: { type: 'base' } })
    .then(products => res.send(products))
})

router.get('/:id', function(req, res, next) {
  Product.findOne({ where: { id: req.params.id } })
    .then(product => res.send(product))
});

//type must be: 'recGamer', 'recArtist', 'recStudent', etc..
router.get('/type/:type', function(req, res, next) {
  let searchObj = {};
  searchObj[req.params.type] = true;
  Option.findAll({ where: searchObj, include: [{ model: Product, as: 'BaseModels' }, { model: Product, as: 'Upgrades' }] })
    .then(products => res.send(products))
});


router.get('/:id/upgrades', function(req, res, next) {
  return Option.findAll({ where: { baseId: req.params.id }, include: [{ model: Product, as: 'Upgrades' }, {model: Product, as: 'BaseModels'}] })
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
