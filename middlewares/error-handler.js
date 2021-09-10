const { isCelebrateError } = require('celebrate');

const {
  errorMessages,
  DEFAULT_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
} = require('../errors/error-config');

module.exports = (err, req, res, next) => {
  const {
    statusCode = DEFAULT_ERROR_CODE,
    message = errorMessages.defaultErrorMessage,
  } = err;

  if (isCelebrateError(err)) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: errorMessages.validationErrorMessage.default });
  }

  res.status(statusCode).send({ message });

  return next();
};
