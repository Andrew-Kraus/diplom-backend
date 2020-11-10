const mongoose = require('mongoose');
const validator = require('validator');

const articleShema = mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: [true, 'url'],
    validate: {
      validator: validator.isURL,
      message: 'Неверно введен адрес',
    },
  },
  image: {
    type: String,
    required: [true, 'url'],
    validate: {
      validator: validator.isURL,
      message: 'Неверно введен адрес',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleShema);
