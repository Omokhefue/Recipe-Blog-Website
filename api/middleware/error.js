const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  // console.log(err);
  error.message = err.message;
  // validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((err) => err.message);

    error = new ErrorResponse(message, 404);
  }
  // duplicate field entry
  if (err.code === 11000) {
    error = new ErrorResponse("that email already exists", 400);
  }
  // bad mongoose ObjectId
  if (err.name === "CastError") {
    error = new ErrorResponse("that id is not valid", 404);
  }
  if (err.message === "no image uploaded") {
    error = new ErrorResponse("No image was uploaded", 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "internal server error" });
};

module.exports = errorHandler;
