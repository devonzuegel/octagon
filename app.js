// requires (general)
  var express = require('express');
  var path = require('path');
  var favicon = require('static-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  var routes = require('./routes/index');
  var users = require('./routes/users');

  var app = express();
  var passport = require('./models/User.js').passport;

// view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');



  app.use(passport.initialize());
  // app.use(session({
    //     cookie : {
    //       maxAge: 3600000 // see below
    //     },
    //     store : new MongoStore(
    //       { db: mongodb.Db( conf.mongodbName,
    //             new mongodb.Server('localhost', 27017,
    //                                 { auto_reconnect: true, native_parser: true }),
    //                                 { journal: true })
    //       }, function(error) {
    //         if(error) {
    //           return console.error('Failed connecting mongostore for storing session data. %s', error.stack);
    //         }
    //         return console.log('Connected mongostore for storing session data');
    //       })
    // }));
    // ...
  app.use(passport.session());

  // app.use(passport.session());
  // app.use(function (req, res, next) {
  //   res.locals.loggedin = req.isAuthenticated();
  //   next();
  // });

  app.use(favicon('./views/congruent_pentagon-DARK.png'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.use(cookieParser());
  // app.use(express.session({secret: '1234567890QWERTY'}));

  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);
  app.use('/users/', users);
  app.set('view options', { layout: false });

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

module.exports = app;
