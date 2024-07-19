const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./Utilities/appError');
const globalErrorHandler = require('./Utilities/errorController');
const app = express();

const mongoSanitize = require('express-mongo-sanitize');

// For limiting number of request from same IP address good security middleware
const rateLimit = require('express-rate-limit');

// For secure HTTP
const helmet = require('helmet');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//GLOBAL MIDDLEWARES

// Set security http headers
app.use(helmet());

// For Sanitization against noSql query injection
app.use(mongoSanitize());

//Data Sanitization against XSS

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

app.use('/', (req, res) => {
  res.status(200).render('base');
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
