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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'errors';

  err.isOperational = err.isOperational || false;

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      isOperational: err.isOperational,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    console.log('prod');
    sendErrProd(err, res);
  }
};
