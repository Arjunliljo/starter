const catchAsync = require('../Utilities/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Success', data: null });
  });
