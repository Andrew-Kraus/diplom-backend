const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { getUser } = require('../controllers/users');

userRouter.get('/me', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getUser);

module.exports = userRouter;
