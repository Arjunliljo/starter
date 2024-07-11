const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../Utilities/appError');
const catchAsync = require('../Utilities/catchAsync');
const sendEmail = require('../Utilities/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

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
  if (!token) return next(new AppError('Please login to get access', 401));

  // 2) Varify token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check the user is still exist to make sure
  const currentUser = await User.findById(decode.id);

  if (!currentUser)
    return next(new AppError('The User belong to this token is not exist'));

  // 4) Check the password is changed after the token is issued ::
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

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      // If not, pass an error to the next middleware
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    // If the user is authorized, proceed to the next middleware
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError('No email address provided'));

  //find the user with the email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError(`No User found on ${req.body.email} this email`, 404),
    );

  //Generate the random reset token
  const resetToken = user.createPasswordsResetToken();
  await user.save();

  //Send the token to user email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset/${resetToken}`;

  const message = `Forgot your message ? submit a patch request with your new password and password confirm to : ${resetUrl} if you don't forgot your password please ignore this email`;

  console.log(user.email);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password token is valid only for 10 mins hurry!',
      message,
    });
    res.status(200).json({ status: 'Success', message: 'Token sent to mail' });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    user.save();
    next(
      new AppError(
        'Something went wrong while sending the email please try again later',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  return null;
});
