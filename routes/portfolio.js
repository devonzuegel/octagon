// Require basic app stuff
var express = require('express'),
    router = express.Router(),
    api_mgr = require('./apiManager');

// Require authentication stuff
var CompanyModel = require('../models/Company.js'),
    Companies = CompanyModel.Companies,
    passport = CompanyModel.passport,
    LocalStrategy = require('passport-local').Strategy,
    privileges = require('./privileges.js');

var OwnerModel = require('../models/Owner.js'),
    Owners = OwnerModel.Owners;

// Function to sort params by name
var sort_by_name = function(a, b) {
  if (!a.name  ||  !b.name)  return 0;
  var x = a.name.toLowerCase(),
      y = b.name.toLowerCase();
  return (x < y) ? -1 : ((x > y) ? 1 : 0);  
};

router.get('/', function(req, res) {
  privileges.require_privileges(
    req, res, 
    false,  // don't include flash error messages
    admin_fn = function() {
      // grab all companies from db for access by 'portfolio' view
      Companies.find({}, function(err, all_companies) {
        Owners.find({}, function(err, all_owners) {
          if (err)    return done(err);

          // render portfolio view
          res.render('portfolio', { 
            title: 'Portfolio', 
            errors: req.flash('error'),
            companies: all_companies,
            owners: all_owners.sort(sort_by_name),
            tab: 'companies',
            username: req.session.username,
            is_admin: true,
          });
        });
      });
    }, 
    user_fn = function() { 
      // redirect to logged in company's page
      res.redirect('/portfolio/' + req.session.permalink); 
    }
  );
});

router.post('/add', function(req, res) {
  //// NOTE: validations happen onclick before submit/post is allowed to occur
  var form = req.body;  // grab body of form
  // Case-insensitive query
  var query = { 'username': { $regex: '^'+form.username+'$', $options: '-i' } };
  // search for company with same username (case insensitive query)
  Companies.find(query, cb = function(err, c) {
    if (err)    return done(err);

    // Search returns empty
    if (c.length === 0) {
      // Only add a company if the search returns empty
      CompanyModel.add(
        form.username,
        form.password, 
        form.init_investmt_date, 
        form.crunchbase_permalink,
        form.owners,
        // after company is added to db, redirect to main portfolio page
        function(c) { res.redirect('/portfolio/'); }
      );

    // search doesn't return empty
    } else {
      // return us to portfolio page
      req.flash('error', 'That company already exists!');
      res.redirect('/portfolio/');
    }
  }); // End of Companies.find()
  
});

router.get('/:permalink', function(req, res) {
  var link = req.params.permalink; // gets :permalink from the url
  var session_link = req.session.permalink; // gets username from session (who's logged in?)

  privileges.require_privileges(
    req, res, 
    false, // don't include flash error messages
    admin_fn = function() { return; }, // if admin, pass & continue on
    user_fn = function() {
      // if authenticated as different user, don't allow access ...
      if (session_link != link)  res.redirect('/portfolio/' + session_link);
      // ... otherwise, pass & continue
    }
  );

  Companies.findOne({ 'permalink': link, }, function(err, company) {
    if (err)    return done(err);
    
    // not a valid company >> doesn't have a profile
    if (company === null  ||  link == 'admin') {
        req.flash('error', 'That company doesn\'t exist! Here are your options:');
        return res.redirect('/portfolio/');

    // is a valid company with a profile
    } else {

      // populate details to pass into 'company' view
      var details = { 
        errors: req.flash('error'),
        username: req.session.username,
        title: company.username,
        name: company.username,
        is_admin: (req.session.username == 'admin'),
        c: company,
        p: company.profile,
        permalink: company.permalink,
        operational: company.operational,
        user_metrics: company.user_metrics,
        economics: company.economics
      };

      // render company view with details passed in
      return res.render('company', details);
    }

  });
});

router.post('/:permalink/edit', function(req, res) {
  var link = req.params.permalink, // gets :permalink from the url
      session_link = req.session.permalink; // gets permalink from session (who's logged in?)


  privileges.require_privileges(
    req, 
    res, 
    false, // don't include flash error messages
    admin_fn = function() { return; }, // if admin, pass & continue on
    user_fn = function() {
      // if authenticated as different user, don't allow access ...
      if (session_link != link)  res.redirect('/portfolio/' + session_link);
      // ... otherwise, pass & continue
    }
  );

  CompanyModel.editProfile(link, req.body, cb = function() { 
    res.redirect('/portfolio/' + link); 
  });
});

router.post('/:permalink/editMetrics', function(req, res) {
  var link = req.params.permalink, // gets :permalink from the url
      session_link = req.session.permalink; // gets permalink from session (who's logged in?)


  privileges.require_privileges(
    req, 
    res, 
    false, // don't include flash error messages
    admin_fn = function() { return; }, // if admin, pass & continue on
    user_fn = function() {
      // if authenticated as different user, don't allow access ...
      if (session_link != link)  res.redirect('/portfolio/' + session_link);
      // ... otherwise, pass & continue
    }
  );

  CompanyModel.editMetrics(
    link, 
    req.body, 
    cb = function() { 
      res.redirect('/portfolio/' + link + '#' + req.body.form_name); 
    }
  );
});

router.post('/:permalink/editSpreadsheet', function(req, res) {
  // console.log(JSON.stringify(req.body, null, 2));
  CompanyModel.editSpreadsheet(
    req.params.permalink, 
    req.body.data, 
    req.body.col_headers,
    req.body.row_headers
  );
});



router.post('/:permalink/deleteDatum', function(req, res) {
  var link = req.params.permalink, // gets :permalink from the url
      session_link = req.session.permalink; // gets permalink from session (who's logged in?)


  privileges.require_privileges(
    req, 
    res, 
    false, // don't include flash error messages
    admin_fn = function() { return; }, // if admin, pass & continue on
    user_fn = function() {
      // if authenticated as different user, don't allow access ...
      if (session_link != link)  res.redirect('/portfolio/' + session_link);
      // ... otherwise, pass & continue
    }
  );

  CompanyModel.deleteDatum(link, req.body, cb = function() { 
    res.redirect('/portfolio/' + link + '#' + req.body.form_name); 
  });
});

module.exports = router;
