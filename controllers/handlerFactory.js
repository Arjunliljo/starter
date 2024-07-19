const AppError = require('../Utilities/appError');
const catchAsync = require('../Utilities/catchAsync');
const APIFeatures = require('../APIFeatures/APIFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document founded on this Id', 400));

    res.status(204).json({ message: 'Success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
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

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const newTour = new Tour({});
    // newTour.save()
    const document = await Model.create(req.body);
    res.status(200).json({
      message: 'Success',
      data: {
        document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No document found on this ID'));

    res.status(200).json({ status: 'Success', doc });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // const queryObj = Object.assign({}, req.query);

    // //Filtering
    // const excludedFields = ['page', 'sort', 'limit', 'field'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // let query = Tour.find();

    //Sorting
    // if (req.query.sort) {
    //   const sortingItems = req.query.sort.split('%').join(' ');
    //   query = query.sort(sortingItems);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //Field limiting
    // if (req.query.field) {
    //   const fields = req.query.field.split('%').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // const skip = (page - 1) * limit;

    // if (req.query.page) {
    //   const count = await Tour.countDocuments();
    //   console.log(count, skip);
    //   if (count <= skip) throw new Error('Page does not exist');
    // }
    // query = query.skip(skip).limit(limit);

    //Excecute query

    // Only for nested review rout (hack)
    let filter = {};
    if (req.params.id) filter = { tour: req.params.id };

    const features = new APIFeatures(Model.find(filter), req.query);
    features.filter().sort().limitFields().paginate(Model.countDocuments());

    const docs = await features.query;

    res.status(200).json({
      message: 'Success',
      results: docs.length,
      docs,
    });
  });
