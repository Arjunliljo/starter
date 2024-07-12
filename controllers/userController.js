const User = require('../Models/userModel');
const catchAsync = require('../Utilities/catchAsync');
const AppError = require('../Utilities/appError');

const filterBody = (body, ...allowedFields) => {
  const newObj = {};

  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = body[el];
  });

  return newObj;
};

exports.updateMyData = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This is not the route for updating password please use /updatepassword',
        400,
      ),
    );

  if (!req.body.email && !req.body.name)
    return next(new AppError('datas not found..', 400));

  const filterObj = filterBody(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.user._id, filterObj, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'Success',
    message: 'User data successfully updated',
    data: {
      user,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: 'Success', data: { users } });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res
    .status(204)
    .json({ status: 'Success', message: 'Successfully deleted the User' });
});
