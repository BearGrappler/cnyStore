'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/members', require('./members'));
router.use('/products', require('./products'));
router.use('/reviews', require('./users'));
router.use('/users', require('./users'));
router.use('/cart', require('./users'));


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
