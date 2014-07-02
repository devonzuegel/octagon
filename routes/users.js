var express = require('express');
var router = express.Router();

// require (authentication stuff)
var UserModel = require('../models/User.js'),
    passport = UserModel.passport,
    LocalStrategy = require('passport-local').Strategy,
		UserDetails = UserModel.UserDetails;

router.get('/', function(req, res) {
	res.render('all_users', { title: 'Portfolio companies:', 
														errors: req.cookies.errors,
														companies: ['company A', 'company B', 'company C'] 
	});
});


router.get('/:username', function(req, res) {
  // var u_param = req.param('username'),
  console.log('req.params.username = %s', req.params.username);
  var u_param = req.params.username;
  var u_cookie = req.cookies.username;
  console.log('u_cookie: %s,  u_param: %s -----------', u_cookie, u_param);

  // if current user doesn't have the right privileges, redirect to login page with descriptive errors
  if (u_param != u_cookie  &&  u_cookie != 'admin') {
  	res.cookie('errors', ['You do not have the right permissions to perform this action.']);
  	return res.redirect('/login');
  }

  console.log('lsdjflksjflksjd');

    UserDetails.findOne({ 'username': u_param, }, function(err, user) {
  	if (err)    return done(err);

  	if (user != null) {
  		return res.render('users', {username: u_param});
  	} else {
  		res.cookie('errors', ['That company doesn\'t exist! Here are your options:']);
  		return res.redirect('/users/all');
  	}
  });
  
});



module.exports = router;
