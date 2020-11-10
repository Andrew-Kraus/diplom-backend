require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const getUserId = require('./routes/users');
const createUser = require('./routes/users');
const login = require('./routes/users');
const getArticle = require('./routes/articles');
const createArticle = require('./routes/articles');
const deleteArticle = require('./routes/articles');
const NotFoundErr = require('./errors/NotFoundErr');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/diplomdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get('/users/me', getUserId);
app.post('/signup', createUser);
app.post('/signin', login);
app.get('/articles', getArticle);
app.post('/articles', createArticle);
app.delete('/articles/:id', deleteArticle);

app.use('*', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
