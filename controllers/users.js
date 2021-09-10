const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;
const config = require('../config');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { errorMessages } = require('../errors/error-config');
const handleErrors = require('../errors/handle-errors');

const { forbiddenErrorMessage } = errorMessages;
const notFoundErrorMessage = errorMessages.notFoundErrorMessages.users;

const getMyUser = (req, res, next) => {
  User.find({ _id: req.user._id })
    .then((user) => res.send({ user: user[0] }))
    .catch((err) => next(handleErrors(err)));
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.init()
        .then(
          User.create({
            name,
            email,
            password: hash,
          })
            .then((user) => res.send({
              _id: user._id,
              name,
              email,
            }))
            .catch((err) => next(handleErrors(err))),
        )
        .catch((err) => next(handleErrors(err)));
    })
    .catch((err) => next(handleErrors(err)));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundErrorMessage);
      if (user._id.toString() !== req.user._id) throw new ForbiddenError(forbiddenErrorMessage);
      return res.send({ user });
    })
    .catch((err) => next(handleErrors(err)));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : config.JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно', token })
        .end();
    })
    .catch((err) => next(handleErrors(err)));
};

const signout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Куки успешно удалены.' });
};

module.exports = {
  getMyUser,
  createUser,
  updateUser,
  login,
  signout,
};
