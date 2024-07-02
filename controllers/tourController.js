const Tour = require('../Models/tourModel');

exports.aliasTourController = async (req, res, next) => {
  req.query.sort = '-ratingsAverage%price';
  req.query.limit = '5';
  req.query.field = 'name%price%difficulty%summary%ratingsAverage';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = Object.assign({}, req.query);

    //Filtering
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let query = Tour.find(queryObj);

    //Sorting
    if (req.query.sort) {
      const sortingItems = req.query.sort.split('%').join(' ');
      query = query.sort(sortingItems);
    } else {
      query = query.sort('-createdAt');
    }

    //Field limiting
    if (req.query.field) {
      const fields = req.query.field.split('%').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const count = await Tour.countDocuments();
      console.log(count, skip);
      if (count <= skip) throw new Error('Page does not exist');
    }
    query = query.skip(skip).limit(limit);

    //Excecute query
    const tours = await query;

    res.status(200).json({
      message: 'Success',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params.id);
  try {
    // const tour = await Tour.findOne({ _id: req.params.id }) //also works;
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'Success', data: tour });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save()
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      message: 'Success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
