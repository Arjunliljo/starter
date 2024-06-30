const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  req.id = val;
  if (val > tours.length)
    return res.status(404).json({ message: 'Invalid ID', status: 'failed' });

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Name or Price',
    });
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    message: 'Success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((tour) => tour.id == req.id);

  res.status(200).json({
    message: 'Success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) res.status(400).json({ message: 'rejected' });
      res.status(201).json({ message: 'Success', data: newTour });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    message: 'Success',
    data: {
      tours: 'Updated tour is here..',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ message: 'Success', data: null });
};
