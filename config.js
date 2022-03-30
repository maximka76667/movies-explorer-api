require('dotenv').config();

const { NODE_ENV, DB_URL, PASSWORD } = process.env;
const config = {};

config.ALLOWED_CORS = [
  'https://max76667.movies.nomoredomains.club',
  'http://max76667.movies.nomoredomains.club',
  'max76667.movies.nomoredomains.club',
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'localhost:5000',
  'http://localhost:5000',
];
config.DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS';
config.JWT_SECRET_DEV = 'jwt-secret';
config.DB_URL = `mongodb+srv://maximgriven:${PASSWORD}@cluster0.kqkml.mongodb.net/explorerdb?retryWrites=true&w=majority`;

module.exports = config;
