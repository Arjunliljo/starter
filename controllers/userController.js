const User = require('../Models/userModel');
const catchAsync = require('../Utilities/catchAsync');

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
exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
