const jwt = require('jsonwebtoken');
const config = require('../config');

const { JWT_SECRET, NODE_ENV } = process.env;
const { errorMessages } = require('../errors/error-config');
const UnauthorizedError = require('../errors/unauthorized-error');

const { unauthorizedErrorMessage } = errorMessages;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(unauthorizedErrorMessage);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.JWT_SECRET_DEV);
  } catch (err) {
    throw new UnauthorizedError(unauthorizedErrorMessage);
  }

  req.user = payload;

  return next();
};
