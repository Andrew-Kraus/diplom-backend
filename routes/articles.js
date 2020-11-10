const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { getArticle, createArticle, deleteArticle } = require('../controllers/articles');

articleRouter.get('/articles', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getArticle);

articleRouter.post('/articles', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    // eslint-disable-next-line
    link: Joi.string().required().regex(/https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]{2,}(\/([a-z]+\/){1,})?|https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]+0?[1-9]+0?([1-9]{1})?((\/[a-z]+){1,})?#?|https?:\/\/[a-z0-9]+\.[a-z]{2,}:[1-9]{1}0?/),
    // eslint-disable-next-line
    image: Joi.string().required().regex(/https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]{2,}(\/([a-z]+\/){1,})?|https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]+0?[1-9]+0?([1-9]{1})?((\/[a-z]+){1,})?#?|https?:\/\/[a-z0-9]+\.[a-z]{2,}:[1-9]{1}0?/),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), createArticle);

articleRouter.delete('/articles/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), deleteArticle);

module.exports = articleRouter;
