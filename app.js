var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
require('./bin/connectDb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter =  require('./routes/admin')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', indexRouter);
app.use('/users', usersRouter);
app.use('/api/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// Centralized error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log the error internally
  console.error('Error status:', err.status, 'Message:', err.message);

  // Respond with the error
  res.status(err.status || 500);
  if (req.app.get('env') === 'development') {
    // Detailed error message for development
    res.render('error', {
      message: err.message,
      error: err
    });
  } else {
    // Generic error message for production
    res.render('error', {
      message: 'An error occurred',
      error: {}
    });
  }
});
module.exports = app;
