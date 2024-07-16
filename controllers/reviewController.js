const Review = require('../Models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourIdAndUserId = (req, res, next) => {
  console.log(req.user.id);
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllreview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
