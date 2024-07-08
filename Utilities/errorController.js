const AppError = require('../Utilities/appError');

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    isOperational: err.isOperational,
    error: err,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (!err.isOperational)
    return res
      .status(500)
      .json({ status: 'failed', message: 'Something Went Wrong' });

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    isOperational: err.isOperational,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const [value] = err.errmsg.match(/"([^"]*)"/);
  const message = `Duplicate field value ${value} . Please use anothor value`;
  return new AppError(message, 400);
};

const handleValidationDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalide input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.isOperational = err.isOperational || false;

  console.log(err.name);
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    //Catching invalid ID
    if (err.name === 'CastError') error = handleCastErrorDB(err);

    //Catching duplicate Fields
    if (err.code === 11000) error = handleDuplicateDB(err);

    //Cathing Validation erro
    if (err.name === 'ValidationError') error = handleValidationDB(err);

    sendErrProd(error, res);
  }
};
