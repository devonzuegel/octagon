/* requires */
	// require (general)
	var express = require('express'),
			router = express.Router(),
		 	app = require('../app.js');

	var uploadManager = require('./uploadManager')(router);
	
	// hash/crypto stuff
	var bcrypt = require('bcryptjs'),
	    salt = bcrypt.genSaltSync(10),  
	    hash = bcrypt.hashSync("B4c0/\/", salt);

	// require (authentication stuff)
	var UserModel = require('../models/User.js'),
	    passport = UserModel.passport,
	    LocalStrategy = require('passport-local').Strategy,
			UserDetails = UserModel.UserDetails;


// home page
	router.get('/', function(req, res) {
		return res.redirect('/users');
	});

// login methods
	router.get('/login', function(req, res) {
		res.render('login', {title: 'Login', errors: req.flash('error')});
	});

	router.post('/login',
							passport.authenticate('local', { failureRedirect: '/login', 
																							 failureFlash: 'Invalid username or password.' }),
						  function(req, res) {
						  	req.session.is_admin = (req.user.username == 'admin');
						  	req.session.username = req.user.username;
						  	if (req.session.is_admin) res.redirect('/');
						  	else											res.redirect('/users/' + req.user.username);
						  }
	);	

	router.get('/new_photo', function(req, res) {
		res.render('new_photo', {title: 'New photo'});
	});

// passport stuff
	passport.serializeUser(function(user, done) {
		// console.log('(serialize)      user= %j', user)
	  done(null, user.id);
	});
	 
	passport.deserializeUser(function(id, done) {
		UserDetails.find({id: id}, function(err, user) {
			if (err)    return done(err);
			// console.log('(deserialize)  user= %j', user);
			done(err, user);
		});
	});

	passport.use(new LocalStrategy(function(username, password, done) {
	  process.nextTick(function() {
	    UserDetails.findOne({ 'username': username, }, function(err, user) {
	      if (err)    	done(err);
	      if (!user)  	return done(null, false);

				if (user.password != password)		return done(null, false);
				else	          									return done(null, user);
	    });
	  });
	}));

module.exports = router;
module.exports.salt = salt;
module.exports.hash = hash;