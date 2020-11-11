const { NODE_ENV, JWT_SECRET = 'secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const handleAuthError = () => {
  throw new AuthError('Необходима авторизация');
};
// eslint-disable-next-line
const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};
// eslint-disable-next-line
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  next();
};
