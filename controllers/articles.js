const Article = require('../models/article');
const BadReqErr = require('../errors/BadReqErr');
const NotFoundErr = require('../errors/NotFoundErr');
const NotEnoughRights = require('../errors/NotEnoughRights');

module.exports.getArticle = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqErr('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (article === null) {
        throw new NotFoundErr('Статья не найдена');
      } else if (req.user._id !== String(article.owner)) {
        throw new NotEnoughRights('У вас недостаточно прав');
      } else {
        article.remove().then((delArticle) => res.send({ data: delArticle }));
      }
    })
    .catch(next);
};
