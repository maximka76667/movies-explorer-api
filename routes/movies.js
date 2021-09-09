const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const { validateLink } = require('../utils/validateLink');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateLink),
    trailer: Joi.string().required().custom(validateLink),
    thumbnail: Joi.string().required().custom(validateLink),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
}), deleteMovie);

module.exports = router;
