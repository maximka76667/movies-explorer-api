const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => /^(https?:\/\/)(www.)?([\w-]{1,32}\.[\w-]{1,32})[^\s]*#?$/.test(link),
      message: 'Ошибка валидации ссылки',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (link) => /^(https?:\/\/)(www.)?([\w-]{1,32}\.[\w-]{1,32})[^\s]*#?$/.test(link),
      message: 'Ошибка валидации ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => /^(https?:\/\/)(www.)?([\w-]{1,32}\.[\w-]{1,32})[^\s]*#?$/.test(link),
      message: 'Ошибка валидации ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  versionKey: false,
})

module.exports = mongoose.model('movie', movieSchema);