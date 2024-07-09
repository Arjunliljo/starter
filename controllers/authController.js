const { promisify } = require('util');
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
    changePasswordDate: req.body.changePasswordDate,
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

  //select the user
  const user = await User.findOne({ email }).select('+password');

  //Check if the user is exist && check the password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Password or Email', 401));
  }

  //if everything is okey send the token back to the client
  const token = generateToken(user._id);
  res.status(200).json({ status: 'Success', token });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.replace('Bearer', '').trim();
  }
  if (!token)
    return next(
      new AppError(
        'You are not logged in Please login to get access of tours',
        401,
      ),
    );

  // 2) Varify token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check the user is still exist to make sure
  const currentUser = await User.findById(decode.id);

  if (!currentUser)
    return next(new AppError('The User belong to this token is not exist'));

  // 4) Check the password is changed after the token is issued - changed password on one device logout in all devices
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        'The User recently changed password, Please login again',
        401,
      ),
    );
  }

  //Grand access to the protected rout
  req.user = currentUser;
  next();
});
