'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Review = require('../../../db').model('Review');

router.param('id', (req, res, next, id) => {
  if (/[^0-9]/.test(String(id))) return res.sendStatus(400);
  next();
})

router.get('/all/:id', (req, res, next) => {
  Review.findAll({ where: { ProductId: req.params.id } })
    .then(reviews => {
      if (!reviews.length) {
        return res.sendStatus(404);
      } else {
        return res.send(reviews);
      }
    })
    .catch(next);
})

router.get('/:id', (req, res, next) => {
  Review.findById(req.params.id)
    .then(review => {
      if (!review) {
        return res.sendStatus(404);
      } else {
        return res.send(review);
      }
    })
    .catch(next);
})

router.delete(':/id', (req, res, next) => {
  Review.findById(req.params.id).then(review => {
    if (!review) {
      return res.sendStatus(204);
    } else {
      review.destroy()
        .then(() => res.sendStatus(200))
        .catch(next);
    }
  })
})

router.use((req, res, next) => {
    if (!(req.body.hasOwnproperty('rating') && req.body.hasOwnproperty('text'))) return res.sendStatus(400);
    next();
})

router.post('/:id', (req, res, next) => {
  Review.create({
      writtenReview: req.body.text,
      rating: req.body.rating,
      UserId: req.user.id,
      ProductId: req.params.id
    }).then(review => {
      if (!review) {
        return res.sendStatus(500);
      } else {
        return res.send(review);
      }
    })
    .catch(next);
})

router.put('/:id', (req, res, next) => {
  Review.update({
      rating: req.body.rating,
      writtenReview: req.body.text
    }, {
      where: {
        id: req.params.id
      },
      returning: true
    })
    .then(array => {
      if (array[0] !== 1) {
        return res.sendStatus(204);
      } else {
        return res.send(array[1]);
      }
    })
    .catch(next)
})

module.exports = router;
