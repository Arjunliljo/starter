const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// for this route its root is just '/' this we need tourId also we want to get the entire url thats why merge params
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllreview)
  .post(
    authController.authorize('USER'),
    reviewController.setTourIdAndUserId,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
