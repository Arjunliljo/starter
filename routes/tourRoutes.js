const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// tour middlewares
// router.param('id', tourController.checkID);

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
  .delete(tourController.deleteTour);

module.exports = router;
