import { BadRequestError } from "../core/error.response.js";
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new BadRequestError(message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err?.errmsg?.match(/(["'])(\\?.)*?\1/)[0] || "";

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new BadRequestError(message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new BadRequestError(message);
};

const sendError = (err, req, res) => {
  console.error("ERROR 💥", err);

  if (!res.headersSent) {
    res.setHeader("Content-Type", "application/json");
    return res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || "An unexpected error occurred",
    });
  }
};
const globalErrorController = (error, req, res, next) => {
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  sendError(error, req, res);
};

export default globalErrorController;
