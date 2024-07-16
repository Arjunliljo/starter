const Tour = require('../Models/tourModel');
const APIFeatures = require('../APIFeatures/APIFeatures');
const catchAsync = require('../Utilities/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTourController = async (req, res, next) => {
  req.query.sort = '-ratingsAverage%price';
  req.query.limit = '5';
  req.query.field = 'name%price%difficulty%summary%ratingsAverage';
  next();
};

exports.getTourStates = catchAsync(async (req, res, next) => {
  const totalTour = await Tour.countDocuments();

  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    message: 'Success',
    totalTour,
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tour: { $push: '$name' },
        difficulty: { $push: '$difficulty' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    message: 'Success',
    data: plan,
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
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
  const features = new APIFeatures(Tour.find(), req.query);
  features.filter().sort().limitFields().paginate(Tour.countDocuments());

  const tours = await features.query;

  res.status(200).json({
    message: 'Success',
    results: tours.length,
    data: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  res.status(200).json({ status: 'Success', data: tour });
});

// exports.getTour = async (req, res) => {
//   try {
//     // const tour = await Tour.findOne({ _id: req.params.id }) //also works;
//     const tour = await Tour.findById(req.params.id);
//     res.status(200).json({ status: 'Success', data: tour });
//   } catch (err) {
//     res.status(400).json({ status: 'fail', message: err.message });
//   }
// };

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save()
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    message: 'Success',
    data: newTour,
  });
});

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
