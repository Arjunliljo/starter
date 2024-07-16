const Review = require('../Models/reviewModel');
const catchAsync = require('../Utilities/catchAsync');
const factory = require('./handlerFactory');

exports.getAllreview = catchAsync(async (req, res, next) => {
  let filter = {};
  console.log(req.params);
  if (req.params.id) filter = { tour: req.params.id };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'Success',
    data: {
      reviews,
    },
  });
});

exports.getReview = factory.getOne(Review);

exports.setTourIdAndUserId = (req, res, next) => {
  console.log(req.user.id);
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
