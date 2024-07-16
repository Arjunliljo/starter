const User = require('../Models/userModel');
const catchAsync = require('../Utilities/catchAsync');
const AppError = require('../Utilities/appError');
const factory = require('../controllers/handlerFactory');

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: 'Success', data: null });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
