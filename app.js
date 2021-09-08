require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { isCelebrateError, celebrate, Joi } = require('celebrate');

const { validateLink } = require('./utils/validateLink');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', err => {
  if(err) throw err;
  console.log('Connected to MongoDB.')
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// User signup
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).custom(validateLink),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

// User signin
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use(errorLogger);

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message = errorMessages.defaultErrorMessage } = err;

  if (isCelebrateError(err)) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: errorMessages.validationErrorMessage });
  }

  res
    .status(statusCode)
    .send({ message });

  return next();
});

app.listen(PORT, () => {
  console.log('Server started.');
});