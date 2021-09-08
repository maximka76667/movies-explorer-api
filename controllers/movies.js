const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { errorMessages } = require('../errors/error-config');
const handleErrors = require('../errors/handle-errors');

const notFoundErrorMessage = errorMessages.notFoundErrorMessages.movies;
const { forbiddenErrorMessage } = errorMessages;

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies: movies.reverse() }))
    .catch((err) => next(handleErrors(err)));
};

const addMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send({ movie }))
    .catch((err) => next(handleErrors(err)));
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(notFoundErrorMessage);
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
      Movie.findByIdAndDelete(movieId)
        .then((movie) => {
          return res.send({ movie });
        })
        .catch((err) => next(handleErrors(err)));
    })
    .catch((err) => next(handleErrors(err)));
  
  // Movie.findByIdAndDelete(movieId)
  //   .then((movie) => {
  //     if (!movie) throw new NotFoundError(notFoundErrorMessage);
  //     if (movie.owner._id.toString() !== req.user._id) {
  //       throw new ForbiddenError(forbiddenErrorMessage);
  //     }
  //     return res.send({ movie });
  //   })
  //   .catch((err) => next(handleErrors(err)));
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};