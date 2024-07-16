const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

router.use('/:id/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTourController, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStates);

router.route('/tour-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, tourController.deleteTour);

module.exports = router;
