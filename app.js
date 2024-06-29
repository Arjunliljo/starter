const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middle ware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((tour) => tour.id == id);

  if (!tour)
    return res
      .status(404)
      .json({ message: 'Not Found The Tour', status: 'Rejected' });

  res.status(200).json({
    message: 'Success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) res.status(400).json({ message: 'rejected' });
      res.status(201).json({ message: 'Success', data: newTour });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length)
    return res.status(404).json({ message: 'Invalid ID', status: 'failed' });

  res.status(200).json({
    message: 'Success',
    data: {
      tours: 'Updated tour is here..',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length)
    return res.status(404).json({ message: 'Invalid ID', status: 'failed' });

  res.status(204).json({ message: 'Success', data: null });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    message: 'This rout is not yet defined',
    status: 'Error',
  });
};

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(port, () => {
  console.log('App running on port ' + port);
});
