const Review = require('../Models/reviewModel');
const catchAsync = require('../Utilities/catchAsync');

exports.getAllreview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'Success',
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  res.send('not Written');
});
exports.createReview = catchAsync(async (req, res, next) => {
  res.send('not Written');
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  res.send('not Written');
});
exports.updateReview = catchAsync(async (req, res, next) => {
  res.send('not Written');
});
