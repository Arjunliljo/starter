const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utilities/appError');
const globalErrorHandler = require('./Utilities/errorController');

// For limiting number of request from same IP address good security middleware
const rateLimit = require('express-rate-limit');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//GLOBAL MIDDLEWARES

app.use(express.json());

if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const limiter = rateLimit({
  // 100 request in one hour from an IP
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from an IP, please try again later...',
});

app.use('/api', limiter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
