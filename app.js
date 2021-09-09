require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

const { PORT = 3000 } = process.env;

// Security
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Validation
const { isCelebrateError, celebrate, Joi } = require('celebrate');

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

const allowedCors = [
  'https://max76667.diploma.nomoredomains.monster',
  'http://max76667.diploma.nomoredomains.monster',
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'localhost:5000',
  'http://localhost:5000',
];

const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', (err) => {
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
      if (allowedCors.includes(origin)) return callback(null, true);
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
