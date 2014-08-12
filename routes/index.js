/* requires */
	// require (general)
	var express = require('express'),
			router = express.Router(),
		 	app = require('../app.js');

	// hash/crypto stuff
	var bcrypt = require('bcryptjs'),
	    salt = bcrypt.genSaltSync(10),  
	    hash = bcrypt.hashSync("B4c0/\/", salt);

	// require (authentication stuff)
	var UserModel = require('../models/Company.js'),
		  Companies = UserModel.Companies,
	    passport = UserModel.passport,
	    LocalStrategy = require('passport-local').Strategy,
		  privileges = require('./privileges.js');

	// require (owner stuff)
	var OwnerModel = require('../models/Owner.js'),
		  Owners = OwnerModel.Owners;

// home page
router.get('/', function(req, res) {
	return res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res) {
	privileges.require_privileges(
		req, res, 
		false,  // Do not include flash error msgs
		admin_fn = function() {
			// Render F8's dashboard
			res.render('dashboard-f8', { 
				title: 'Dashboard', 
				errors: req.flash('error'),
				username: req.session.username,
				is_admin: true  
			});
		}, 
		user_fn = function() { 
			// Render company's individual dashboard
			res.render('dashboard-individual', { 
				title: 'Dashboard', 
				errors: req.flash('error'),
				username: req.session.username,
				is_admin: false  
			});                      
		}
	);
});


router.get('/settings', function(req, res) {
	Owners.find({}, function(err, all_owners) {
		privileges.require_privileges(
			req, res, 
			false,  // Do not include flash error msgs
			admin_fn = function() {
				// Render settings view
				res.render('settings', { 
					title: 'Settings', 
					errors: req.flash('error'),
					username: req.session.username,
					all_owners: all_owners,
					is_admin: true  
				});
			}, 
			user_fn = function() { 
		      // redirect to logged in company's page
		      res.redirect('/portfolio/' + req.session.permalink); 
			}
		);
	});
});

router.post('/settings', function(req, res) {
// ...
});


// login methods
router.get('/login', function(req, res) {
	res.render('login', {title: 'Login', errors: req.flash('error')});
});

router.post('/login', passport.authenticate('local', { 
/* on failure */
	failureRedirect: '/login',  // redirect to '/login' on failure 
	failureFlash: 'Invalid username or password.'  // flash msg
}), function(req, res) {
/* on success */
	// set session info
	req.session.is_admin = (req.user.username == 'admin');
	req.session.username = req.user.username;

	// set session permalink to permalink saved in user profile
	Companies.findOne({ username: req.session.username, }, function(err, company) {
		if (err)    return done(err);
		req.session.permalink = company.permalink;
		res.redirect('/');
	});
});	

router.get('/logout', function(req, res){
	// clear session (using passport)
  req.logout();
  res.redirect('/login');
});	

// passport stuff
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
	Companies.find({id: id}, function(err, user) {
		if (err)    return done(err);
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    Companies.findOne({ 'username': username, }, function(err, user) {
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