// App dependencies
var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    session = require('express-session'),
    index = require('./routes/index'),
    portfolio = require('./routes/portfolio'),
    owners = require('./routes/owners'),
    passport = require('./models/Company.js').passport;
    

var app = express();

// App locals
app.locals.moment = require('moment');
app.locals.usd = function(num) {
  return '$' + (+num).toFixed(2);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: 'twocubed', 
  saveUninitialized: true,
  resave: true
}) );
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/portfolio', portfolio);
app.use('/owners', owners);
app.set('view options', { layout: false });

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  if(req.accepts('html')) {

    // Respond with html page
    res.render('404', { title: '404: not found', url: req.url });
  } else if(req.accepts('json')) { 

    // Respond with json
    res.send({ error: 'Not found' });
    return;
  } else

    // Default to plain-text. send()
    res.type('txt').send('Not found');
});

// Development error handler, prints stacktrace
if(app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// Production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

module.exports = app;