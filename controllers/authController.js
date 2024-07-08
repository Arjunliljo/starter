const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../Utilities/appError');
const catchAsync = require('../Utilities/catchAsync');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = generateToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if the email and password are exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(user.password, password);
  console.log(correct);
  //Check if the user is exist && check the password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Password or Email', 401));
  }

  //if everything is okey send the token back to the client
  const token = generateToken(user._id);
  res.status(200).json({ status: 'Success', token });
});
