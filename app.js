const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('dev'));
}

// app.use((req, res, next) => {
//   console.log('Hello from the middle ware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cannont find the URL ${req.originalUrl} on the page`,
  // });
  const err = new Error(`Cannot find the ${req.originalUrl} on the page !`);
  err.statusCode = 404;
  err.status = 'fail';

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({ status: err.status, message: err.message });
});

module.exports = app;
