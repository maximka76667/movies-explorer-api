require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, DB_URL } = process.env;

// Validation
const { isCelebrateError, celebrate, Joi } = require('celebrate');

// Security
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./middlewares/rate-limiter');

// Config
const { ALLOWED_CORS, DEFAULT_ALLOWED_METHODS } = require('./config');

// Controllers methods
const { createUser, login } = require('./controllers/users');

// Middlewares
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Errors
const {
  errorMessages,
  DEFAULT_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
} = require('./errors/error-config');
const NotFoundError = require('./errors/not-found-error');

const app = express();

mongoose.connect(DB_URL, (err) => {
  if (err) throw err;
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.use(requestLogger);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (ALLOWED_CORS.includes(origin)) return callback(null, true);
      return callback(new Error('Ошибка CORS'), true);
    },
    methods: DEFAULT_ALLOWED_METHODS,
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }),
);

// User signup
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

// User signin
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// Auth
app.use(auth);

// Routes
app.use(require('./routes/index'));

// If route not found
app.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundErrorMessages.routes));
});

app.use(errorLogger);

// Error Handler
app.use((err, req, res, next) => {
  const {
    statusCode = DEFAULT_ERROR_CODE,
    message = errorMessages.defaultErrorMessage,
  } = err;

  if (isCelebrateError(err)) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: errorMessages.validationErrorMessage });
  }

  res.status(statusCode).send({ message });

  return next();
});

app.listen(PORT);
