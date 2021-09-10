require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, DB_URL } = process.env;

// Security
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./middlewares/rate-limiter');

// Config
const { ALLOWED_CORS, DEFAULT_ALLOWED_METHODS } = require('./config');

// Middlewares
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

// Errors
const {
  errorMessages,
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

app.use(requestLogger);

app.use(limiter);

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

app.use(require('./routes/index'));

// If route not found
app.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundErrorMessages.routes));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT);
