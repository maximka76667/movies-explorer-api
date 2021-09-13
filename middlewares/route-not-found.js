const { errorMessages } = require('../errors/error-config');
const NotFoundError = require('../errors/not-found-error');

module.exports = (req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundErrorMessages.routes));
};
