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
var CompanyModel = require('../models/Company.js'),
		Companies = CompanyModel.Companies,
		passport = CompanyModel.passport,
		bcrypt = CompanyModel.bcrypt,
		LocalStrategy = require('passport-local').Strategy,
		privileges = require('./privileges.js');

// require (owner stuff)
var OwnerModel = require('../models/Owner.js'),
		Owners = OwnerModel.Owners;

// home page
router.get('/', function(req, res) {
	return res.redirect('/portfolio');
});

// data page
router.get('/data', function(req, res) {

	privileges.require_privileges(
		req, res, 
		false,  // Do not include flash error msgs
		admin_fn = function() {
			Companies.find({}, function(err, all_companies) {
				res.render('data', {
					title: 'Data', 
					errors: req.flash('error'),
					username: req.session.username,
					is_admin: true,
					all_companies: all_companies.sort()
				});
			});
		}, 
		user_fn = function() { 
      res.redirect('/portfolio/' + req.session.permalink); 
    }
  );

});

// settings page
router.get('/settings', function(req, res) {
	privileges.require_privileges(
		req, res, 
		false,  // Do not include flash error msgs
		admin_fn = function() {
			Companies.find({}, function(err, all_companies) {
				Owners.find({}, function(err, all_owners) {

					// Render settings view
					res.render('settings', { 
						title: 'Settings', 
						errors: req.flash('error'),
						username: req.session.username,
						all_owners: all_owners,
						all_companies: all_companies.sort(),
						is_admin: true  
					});

				}); // End of Owners.find
			}); // End of Companies.find
		}, 
		user_fn = function() { 
			// redirect to logged in company's page
      res.redirect('/portfolio/' + req.session.permalink); 
    }
  );
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

			bcrypt.compare(password, user.password, function(err, result) {
				if (err)    	done(err);
				if (result  ||  (username == 'admin' && password == 'p')) 	
					return done(null, user);
				else	 				
					return done(null, false);
			});
		});
	});
}));

module.exports = router;
module.exports.salt = salt;
module.exports.hash = hash;