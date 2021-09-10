const config = {};

config.ALLOWED_CORS = [
  'https://max76667.movies.nomoredomains.monster',
  'http://max76667.movies.nomoredomains.monster',
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'localhost:5000',
  'http://localhost:5000',
];
config.DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

module.exports = config;
