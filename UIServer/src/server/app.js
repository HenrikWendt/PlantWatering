var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require("mongoose");

//mongoose.set("useNewUrlParser", true);
//mongoose.set("useFindAndModify", false);
//mongoose.set("useCreateIndex", true);

var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var login = require('./routes/login');
var createAccount = require('./routes/createAccount');
var logout = require('./routes/logout');
var fetchData = require('./routes/fetchData');
var waterPlants = require('./routes/waterPlants');

const config = require("./config");
const dbUrl = config.dbUrl;

var options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);

app.use('/login', login);
app.use('/createAccount', createAccount);
app.use('/logout', logout);
app.use('/fetchData', fetchData);
app.use('/waterPlants', waterPlants);

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
