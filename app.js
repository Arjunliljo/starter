const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utilities/appError');
const globalErrorHandler = require('./Utilities/errorController');

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
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
