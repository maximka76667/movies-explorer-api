const Movie = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { errorMessages } = require('../errors/error-config');
const handleErrors = require('../errors/handleErrors');

const notFoundErrorMessage = errorMessages.notFoundErrorMessages.cards;
const { forbiddenErrorMessage } = errorMessages;

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
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

  Movie.findByIdAndDelete(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(notFoundErrorMessage);
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
      return res.send({ movie });
    })
    .catch((err) => next(handleErrors(err)));
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};