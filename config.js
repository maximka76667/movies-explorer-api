require("dotenv").config();

const { PASSWORD } = process.env;
const config = {};

config.ALLOWED_CORS = [
  "https://max76667.movies.nomoredomains.club",
  "http://max76667.movies.nomoredomains.club",
  "max76667.movies.nomoredomains.club",
  "localhost:3000",
  "http://localhost:3000",
  "localhost:3001",
  "http://localhost:3001",
  "localhost:5000",
  "http://localhost:5000",
  "https://maximka76667.github.io",
  "maximka76667.github.io",
];

config.DEFAULT_ALLOWED_METHODS = "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS";
config.JWT_SECRET_DEV = "jwt-secret";
config.DB_URL = `mongodb+srv://maximgriven:${PASSWORD}@main-cluster.6v4ft.mongodb.net/?retryWrites=true&w=majority&appName=Main-Cluster`;

module.exports = config;
