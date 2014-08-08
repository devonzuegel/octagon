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
      })
    });
  }, function() { 
    res.redirect('/portfolio/' + req.session.permalink); 
  });

});

// add_user methods
router.get('/add_user', function(req, res) {
  console.log('req.params:  ' + req.params);
  require_privileges(req, res, true, function() {  return;  }, function() {  
    return res.redirect('/portfolio/' + req.session.permalink);  
  });

  res.render('add_company', { 
    title:"New Company", 
    is_admin: true, 
    errors: undefined,
    p: {},
    username: req.session.username,
    tab: 'companies' 
  });

});

router.post('/add_user', function(req, res) {

  console.log('req.params:  ' + req.params);
  var form = req.body;

  if (form.password == '') {
    req.flash('error', 'Please enter a password.');
    return res.redirect('/portfolio/add_user');
  }

  if (form.password2 != form.password) {
    req.flash('error', 'Please make sure your passwords match.');
    return res.redirect('/portfolio/add_user');
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
      function() { res.redirect('/portfolio/'); }
    );  
  });

});

router.get('/:permalink', function(req, res) {
  console.log('req.params:  ' + req.params);
  var link = req.params.permalink; // gets :permalink from the url
  // if (link == 'add_user')    res.redirect('/portfolio/add_user');
  var session = req.session.permalink; // gets username from session (who's logged in?)
  console.log('session  ' + session);

  require_privileges(req, res, false, function() { return }, function() {
    if (req.session.permalink != link)     res.redirect('/portfolio/' + session);
  });

  CompanyDetails.findOne({ 'permalink': link, }, function(err, company) {
    if (err)    return done(err);

    if (company == null  ||  link == 'admin') { // not a valid company >> doesn't have a profile
        req.flash('error', 'That company doesn\'t exist! Here are your options:.')
        return res.redirect('/portfolio');
    } else { // is a valid company with a profile
      var details = { 
        errors: req.flash('error'),
        username: req.session.username,
        title: company.username,
        name: company.username,
        is_admin: (req.session.username == 'admin'),
        p: company.profile,
        permalink: company.permalink
      };
      return res.render('company', details);
    }
  });
});

router.post('/:permalink/edit', function(req, res) {
  var link = req.params.permalink; // gets :permalink from the url
  var session = req.session.permalink; // gets username from session (who's logged in?)

  require_privileges(req, res, false, function() { return; }, function() {
    if (session != link)       res.redirect('/portfolio/' + session);
  });


  // CompanyModel.update(link, user.profile, req.body);
  CompanyDetails.findOne({ permalink: link }, function (err, user) {
    if (err)  return done(err);

    var profile = {};
    // populate profile with original user.profile
    for (var k in user.profile)  profile[k] = user.profile[k];
    // update the changes from the form
    for (var k in req.body)      profile[k] = req.body[k];
    // update profile
    user['profile'] = profile;

    // save & redirect to updated profile
    user.save(function() { res.redirect('/portfolio/' + link); });
  })

});


module.exports = router;
module.exports.require_privileges = require_privileges;