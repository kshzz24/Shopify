const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid : ${err.path}`;
    err = new ErrorHandler(message, 404);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {

    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;

    err = new ErrorHandler(message, 404);

  }
   
  // wrong json webtoken
  if (err.name === "jsonWebTokenError") {

    const message = `Json Web Token is Invalid Try Again`;

    err = new ErrorHandler(message, 404);

  }
   //JWT Expire

  if (err.name === "TokenExpiredError") {

    const message = `Json Web Token is Expired Try Again`;

    err = new ErrorHandler(message, 404);

  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message, // Send the error message only
  });
};
