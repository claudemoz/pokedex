const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(limiter)
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use('/api/v1', require('@routes/v1'));
module.exports = app;
