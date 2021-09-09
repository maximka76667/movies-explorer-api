require('dotenv').config();

const config = {};

config.DB_URL = 'mongodb://localhost:27017';
config.ALLOWED_CORS = [
  'https://max76667.diploma.nomoredomains.monster',
  'http://max76667.diploma.nomoredomains.monster',
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'localhost:5000',
  'http://localhost:5000',
];
config.DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';
config.PORT = process.env.PORT || 3000;
config.NODE_ENV = process.env.NODE_ENV;
config.JWT_SECRET = process.env.JWT_SECRET;

module.exports = config;
