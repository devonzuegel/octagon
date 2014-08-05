var express = require('express');
var router = express.Router();
var api_mgr = require('./apiManager');

// require (authentication stuff)
var CompanyModel = require('../models/Company.js'),
    passport = CompanyModel.passport,
    LocalStrategy = require('passport-local').Strategy,
		CompanyDetails = CompanyModel.CompanyDetails;

function require_privileges(req, res, include_msgs, admin_fn, user_fn) {
  if (req.isAuthenticated() && req.session.is_admin) {
    admin_fn(req, res);
  } else {
    if (include_msgs)   req.flash('error', 'You do not have permission to perform that action.');
    if (!req.isAuthenticated()) res.redirect('../login');
    else    user_fn(req, res);
  }
}

router.get('/', function(req, res) {

  require_privileges(req, res, false, function() {
    CompanyDetails.find({}, function(err, all_companies) {
      if (err)    return done(err);
      res.render('portfolio', { 
        title: 'Portfolio', 
        errors: req.flash('error'),
        companies: all_companies,
        tab: 'companies',
        username: req.session.username,
        is_admin: true
      });
    });
  }, function() { 
    res.redirect('/users/' + req.session.username); 
  });

});

// add_user methods
router.get('/add_user', function(req, res) {
  require_privileges(req, res, true, function() {  return;  }, function() {  
    return res.redirect('/users/' + req.session.username);  
  });

  res.render('add_company', { 
    title:"New Company", 
    is_admin: true, 
    errors: undefined,
    username: req.session.username,
    tab: 'companies' 
  });

});

router.post('/add_user', function(req, res) {

  var form = req.body;

  if (form.password == '') {
    req.flash('error', 'Please enter a password.');
    return res.redirect('/users/add_user');
  }

  if (form.password2 != form.password) {
    req.flash('error', 'Please make sure your passwords match.');
    return res.redirect('/users/add_user');
  }

  CompanyDetails.find({'username': form.username }, function(err, u) {
    if (err)    return done(err);
    // TODO ensure user hasn't yet been added

    CompanyModel.add(
      form.username,
      form.password, 
      form.init_investmt_date, 
      form.crunchbase_permalink,
      form.owners,
      function() { res.redirect('/users/'); }
    );  
  });

});

router.get('/:username', function(req, res) {
  var u_param = req.params.username; // gets :username from the url
  if (u_param == 'add_user')    res.redirect('/users/add_user');
  var u_session = req.session.username; // gets username from session (who's logged in?)

  require_privileges(req, res, false, function() { return }, function() {
    if (u_session != u_param)     res.redirect('/users/' + u_session);
  });

  CompanyDetails.findOne({ 'username': u_param, }, function(err, user) {
    if (err)    return done(err);

    if (user == null  ||  u_param == 'admin') { // not a valid company >> doesn't have a profile
        req.flash('error', 'That company doesn\'t exist! Here are your options:.')
        return res.redirect('/users');
    } else { // is a valid company with a profile
      var details = { 
        errors: req.flash('error'),
        username: req.session.username,
        title: u_param,
        is_admin: (u_session == 'admin'),
        p: user.profile
      };
      return res.render('company', details);
    }
  });
});

router.post('/:username/edit', function(req, res) {
  var u_param = req.params.username;    // gets :username from the url
  var u_session = req.session.username; // gets username from session (who's logged in?)

  require_privileges(req, res, false, function() { return; }, function() {
    if (u_session != u_param)       res.redirect('/users/' + u_session);
  });

  CompanyDetails.findOne({ username: u_param }, function (err, user) {
    if (err)  return done(err);

    var profile = {};
    // populate profile with original user.profile
    for (var k in user.profile)  profile[k] = user.profile[k];
    // update the changes from the form
    for (var k in req.body)      profile[k] = req.body[k];
    // update profile
    user['profile'] = profile;

    // save & redirect to updated profile
    user.save(function() { res.redirect('/users/' + u_param); });
  })

});


module.exports = router;
module.exports.require_privileges = require_privileges;