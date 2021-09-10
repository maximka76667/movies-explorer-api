const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { getMyUser, updateUser, signout } = require('../controllers/users');
const { validateLink } = require('../utils/validateLink');

// Movies routes
router.get('/movies', getMovies);

router.post(
  '/movies',
  celebrate({
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
  }),
  addMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required(),
    }),
  }),
  deleteMovie,
);

// Users routes
router.get('/users/me', getMyUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

router.get('/signout', signout);

module.exports = router;
