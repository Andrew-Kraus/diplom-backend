const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadReqErr = require('../errors/BadReqErr');
const ConflictError = require('../errors/ConflictError');
const AuthError = require('../errors/AuthError');
const NotFoundErr = require('../errors/NotFoundErr');

const { NODE_ENV, JWT_SECRET = 'secret-key' } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ email: user.email, name: user.name });
      }
      throw new NotFoundErr('Пользователя не существует');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, password, email } = req.body;
  if (!password) {
    throw new BadReqErr('Переданы некорректные данные');
  }
  User.init().then(() => {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({ name, password: hash, email }))
      .then((user) => User.findById(user._id))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadReqErr('Переданы некорректные данные');
        } else if (err.name === 'MongoError' && err.code === 11000) {
          throw new ConflictError('Этот email адрес уже занят');
        }
        next(err);
      })
      .catch(next);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 900000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

module.exports.logout = async (req, res, next) => {
  try {
    return await res.clearCookie('jwt', {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
      .send('Вы вышли из аккаунта');
  } catch (err) {
    return next();
  }
};
