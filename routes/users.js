const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getMyUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
const { validateLink } = require('../utils/validateLink');

router.get('/me', getMyUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = router;