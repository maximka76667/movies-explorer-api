const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UnauthorizedError = require('../errors/unauthorized-error');
const { errorMessages } = require('../errors/error-config');

const { incorrectCredentialsErrorMessage } = errorMessages;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: errorMessages.validationErrorMessage.email,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
  },
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError(incorrectCredentialsErrorMessage);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) throw new UnauthorizedError(incorrectCredentialsErrorMessage);
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
