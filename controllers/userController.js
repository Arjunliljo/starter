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
exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res
    .status(204)
    .json({ status: 'Success', message: 'Successfully deleted the User' });
});
