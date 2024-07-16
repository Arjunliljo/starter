const AppError = require('../Utilities/appError');
const catchAsync = require('../Utilities/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    console.log(req.params.id);

    if (!doc) return next(new AppError('No document founded on this Id', 400));

    res.status(204).json({ message: 'Success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          'This is not the route for updating password please use /updatepassword',
          400,
        ),
      );

    if (!doc) return next(new AppError('No document founded on this Id', 400));

    res.status(200).json({
      message: 'Success',
      data: {
        doc,
      },
    });
  });
