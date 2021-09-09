const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

// Validation
const { isCelebrateError, celebrate, Joi } = require('celebrate');

// Security
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./middlewares/rate-limiter');

// Config
const { PORT, DB_URL, ALLOWED_CORS, DEFAULT_ALLOWED_METHODS } = require('./config');

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
  NOT_FOUND_ERROR_CODE,
} = require('./errors/error-config');

const app = express();

mongoose.connect(`${DB_URL}/moviesdb`, (err) => {
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
  })
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
  createUser
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
  login
);

// Auth
app.use(auth);

// Routes
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

// If route not found
app.use((req, res, next) => {
  res.status(NOT_FOUND_ERROR_CODE);

  // respond with html page
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, './utils/index.html'));
  }

  // respond with json
  if (req.accepts('json')) {
    return res.json({ message: 'Not found' });
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');

  return next();
});

app.use(errorLogger);

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message = errorMessages.defaultErrorMessage } = err;

  if (isCelebrateError(err)) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: errorMessages.validationErrorMessage });
  }

  res.status(statusCode).send({ message });

  return next();
});

app.listen(PORT);
