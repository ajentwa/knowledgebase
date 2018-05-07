const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')

// Make Connection
mongoose.connect(config.database);
const db = mongoose.connection;

// Check Connection
db.once('open', function(){
  console.log('connected to mongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Route File Connection
const indexRouter = require('./routes/index');
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');

// Init App
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator Middleware
app.use(expressValidator());

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// app.get('*', function(req, res, next){
//   req.locals.user = req.user || null;
//   next();
// });

// user = function(req, res, next) {
//   res.locals.user = req.user;
//   next();
// };

app.use(function(req,res,next){
   res.locals.user = req.user;
   next();
});

// Route File
app.use('/', indexRouter);
app.use('/articles', articlesRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
