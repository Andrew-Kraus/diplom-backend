require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://andrew-kraus.github.io/diplom-frontend',
    'https://andrew-kraus.github.io',
    'http://localhost:8080',
    'https://Andrew-Kraus.github.io',
    'https://Andrew-Kraus.github.io/diplom-frontend',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'Authorization',
    'x-access-token',
    'accept',
  ],
  credentials: true,
};
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const NotFoundErr = require('./errors/NotFoundErr');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/backendkraus', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.use('/', require('./routes/regAndAuth'));
app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

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
