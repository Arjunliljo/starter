const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utilities/appError');
const globalErrorHandler = require('./Utilities/errorController');

// For limiting number of request from same IP address good security middleware
const rateLimit = require('express-rate-limit');

// For secure HTTP
const helmet = require('helmet');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//GLOBAL MIDDLEWARES

// Set security http headers
app.use(helmet());

// body parser : reading body from req.body
// larger than 10kb file should not accepted by this
app.use(express.json({ limit: '10kb' }));

// development logging
if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('dev'));
}

// Test middle ware
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

// Limiting requests from a single IP
app.use('/api', limiter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
