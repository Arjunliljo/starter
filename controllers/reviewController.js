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
  const review = await Review.find({ _id: req.params.reviewId });

  res.status(200).json({ status: 'Success', data: { review } });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(200).json({ status: 'Success', data: { review: newReview } });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  res.send('not Written');
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  res
    .status(204)
    .json({ status: 'Success', message: 'Reveiew Deleted successfully' });
});
