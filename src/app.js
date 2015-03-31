var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var festivals = require('./routes/festivals');
var festival = require('./routes/festival');
var index = require('./routes/index');
var editions = require('./routes/editions');
var artists = require('./routes/artists');

var app = express();

//database connection
mongoose.connect(process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/fucking-rumors-dev');
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

//set port
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// log handlers
// Remove console log in production mode
if(process.env.NODE_ENV == "production"){
    console.log = function(){}; 
}

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// mandatory with bootstrap
app.locals.pretty = true;

// create routes
// route user + passport
app.use('/', index);
app.use('/festivals', festivals);
app.use('/festival', festival);
app.use('/editions', editions);
app.use('/artistes', artists);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("Erreur 404");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log("Gestion des erreurs Dev -- Début");

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });

     console.log("Gestion des erreurs Dev -- Fin");
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("Gestion des erreurs Prod -- Début");

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });

  console.log("Gestion des erreurs Prod -- Début");
});

module.exports = app;
