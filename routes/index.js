const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const {
  createUser, login, getMyUser, updateUser, signout,
} = require('../controllers/users');
const { validateLink } = require('../utils/validateLink');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// Movies routes
router.get('/movies', auth, getMovies);

router.post(
  '/movies',
  auth,
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validateLink),
      trailer: Joi.string().required().custom(validateLink),
      thumbnail: Joi.string().required().custom(validateLink),
      movieId: Joi.number().integer().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  addMovie,
);

router.delete(
  '/movies/:movieId',
  auth,
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

// Users routes
router.get('/users/me', auth, getMyUser);

router.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

router.get('/signout', auth, signout);

module.exports = router;
