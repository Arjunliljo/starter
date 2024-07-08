const AppError = require('./appError');

module.exports = catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) =>
      next(new AppError('Cannot Found results on This ID', 404)),
    );
  };
};
