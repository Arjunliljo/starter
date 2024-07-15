const express = require('express');
const router = express.Router();

const reviewContoller = require('../controllers/reviewController');

router
  .route('/')
  .get(reviewContoller.getAllreview)
  .post(reviewContoller.createReview);

router
  .route('/:reviewId')
  .get(reviewContoller.getReview)
  .patch(reviewContoller.updateReview)
  .delete(reviewContoller.deleteReview);

module.exports = router;
