let router = require('express').Router(); // eslint-disable-line new-cap
let Product = require('../../../db').model('Product')
let Option = require('../../../db').model('Option')

router.get('/', function(req, res, next) {
  Product.findAll({ where: { type: 'base' } })
    .then(products => res.send(products))
    .catch(() => res.sendStatus(500));
})

router.get('/:id', function(req, res, next) {
  Product.findOne({ where: { id: req.params.id }, include: [{ association: Product.Review }] })
    .then(product => res.send(product))
    .catch(() => res.sendStatus(500));
});

//type must be: 'recGamer', 'recArtist', 'recStudent', etc..
router.get('/type/:type', function(req, res, next) {
  let searchObj = {};
  searchObj[req.params.type] = true;
  Option.findAll({ where: searchObj, include: [{ model: Product, as: 'BaseModels' }, { model: Product, as: 'Upgrades' }] })
    .then(products => res.send(products))
    .catch(() => res.sendStatus(500));
});


router.get('/:id/upgrades', function(req, res, next) {
  Option.findAll({ where: { baseId: req.params.id }, include: [{ model: Product, as: 'Upgrades' }, { model: Product, as: 'BaseModels' }] })
    .then(options => {
      options.forEach(option => {
        if (option.defOption) {
          option.Upgrades.dataValues.defOption = true;
        }
      })
      return options;
    })
    .then(options => res.send(options))
    .catch(() => res.sendStatus(500));
});

router.put('/:id', function(req, res, next) {
  if (req.user && req.user.isAdmin) {
    Product.findOne({ where: { id: req.params.id } })
      .then(product => product.update({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        msrp: req.body.msrp,
        price: req.body.price,
        description: req.body.description,
        imageUrls: req.body.imageUrls,
        type: req.body.type,
        inventory: req.body.inventory
      }))
      .then(product => res.send(product))
      .catch(() => res.sendStatus(500));
  }
  else {
    res.sendStatus(401)
  }
});

router.delete('/:id', function(req, res, next) {
  if (req.user && req.user.isAdmin) {
    Product.findOne({ where: { id: req.params.id } })
      .then(product => product.destroy())
      .then(() => res.sendStatus(204))
      .catch(() => res.sendStatus(500));
  }
  else {
    res.sendStatus(401)
  }
});

module.exports = router;
