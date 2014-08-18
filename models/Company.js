// Requires
var passport = require('passport'),
    mongoose = require('mongoose/'),
    api_mgr = require('../routes/apiManager');

// var Owners = require('../models/Owner.js').Owners;

mongoose.connect('mongodb://localhost/test');

// var bcrypt = require('bcrypt');

var Schema = mongoose.Schema,
    CompanySchema = new Schema({
      username: String,
      password: String,
      init_investmt_date: 'object',
      img_path: String,
      crunchbase_permalink: String,
      crunchbase_prof: 'object',
      owners: 'object',
      profile: 'object',
      permalink: String,
      operational: 'object',
      user_metrics: 'object',
      economics: 'object'
    }, {
      collection: 'companies'
    }),
    Companies = mongoose.model('companies', CompanySchema);

/* Function to shorten description */
function shorten(description) {
  // Description char limit
  var limit = 600;
  // Return shortened description with ellipsis
  return description.substring(0, limit) + '... ';
}

/* Function to remove unwanted link formatting */
function findLinks(description) {
  // Regex to match onto the link syntax Crunchbase gives
  var link = /\[([^\[\]\(\)]+)+\]\(([^\[\]\(\)]+)+\)/g;
  // Replace all occurances of links with text format & return the new description
  return description.replace(link, '$1');
}

/* Function for transforming object arrays to strings */
function obj_arr_to_str(p, obj) {
  // Initialize an empty string
  var str = '';

  // If the obj is defined, concatenate each of its children's names
  if (p.relationships[obj]) {
    for (var i = 0; i < p.relationships[obj].items.length; i++) {
      // Concatenate comma to front unless it's 0th
      if (i != 0) str += ', ';
      // Concatenate name
      str += p.relationships[obj].items[i].name;
    }

    // Return resulting string
    return str; 

  // If obj is not defined
  } else {
    return undefined;
  }
}

/* Convert number to USD format */
function usd(num) {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/* Simplify crunchbase profile object */
function simplify_crunchbase_prof(p) {
  return simplified_p = { 
    img_path:      (p.relationships.primary_image) ? "http://images.crunchbase.com/" + p.relationships.primary_image.items[0].path : undefined,
    short_descrip: p.properties.short_description,
    description:   (p.properties.description) ? shorten(findLinks(p.properties.description)) : undefined,
    homepage_url:  (p.properties.homepage_url) ? p.properties.homepage_url.replace('http://', '') : undefined,
    founded_on:    p.properties.founded_on,
    total_funding: (p.properties.total_funding_usd) ? usd(p.properties.total_funding_usd) : undefined,

    // Comma-separated string of founders' names
    founders:      obj_arr_to_str(p, 'founders'),

    // Comma-separated string of categories
    categories:    obj_arr_to_str(p, 'categories')
  };
}


module.exports = {

  // Add a new company
  add: function(username, password, init_investmt_date, crunchbase_permalink, owners, cb) {
    
    if (crunchbase_permalink == '') {
      crunchbase_permalink = 'NO_PERMALINK_SELECTED';
    }

    // Create empty permalink string
    var permalink = '';

    // Use the Crunchbase API to get the company data
    api_mgr.get_cmpny(crunchbase_permalink, function(body) {

      // Parse data from crunchbase response
      var p = JSON.parse(body).data;

      // Create empty profile to be saved into the new company
      var profile = {};

      /* Check that crunchbase request returns successfully with 
       * complete profile. Not equivalent to (p.response == true)
       * because need to ensure existence too */
      if (p.response != false) {

        // There is a valid crunchbase permalink, so use that
        permalink = crunchbase_permalink;

        // Build profile based on crunchbase to be saved
        profile = simplify_crunchbase_prof(p);

      // Else if crunchbase request returned empty
      } else if (username) { 

        // Create own permalink
        permalink = username.replace(/\s+/g, '-').toLowerCase();
      }

      // Create object of operational metrics
      var operational = {
        gross_burn: [],
        net_burn: [],
        revenue: [],
        head_count: []
      };

      // Create object of user metrics
      var user_metrics = {
        avg_dau: [],
        avg_mau: [],
        churn: []
      };

      // Create object of unit economics
      var economics = {
        ltv: [],
        lifetime_est: [],
        cac: [],
        asp: [],
        gm_percentage: []
      };

      // Build up company hash with details from above
      var company = { 
        'username': username,
        'password': password, 
        'init_investmt_date': init_investmt_date,
        'crunchbase_permalink': crunchbase_permalink,
        'crunchbase_prof': p,
        'owners': owners,
        'profile': profile,
        'permalink': permalink,
        'operational': operational,
        'user_metrics': user_metrics,
        'economics': economics
      };

      // Create new company with profile info included
      Companies.create(company, function (err, c) {
        if (err)  return done(err);
        cb(c);
      });
    });
  },

  // Edit company profile information
  editProfile: function(link, form, cb) {
    Companies.findOne({ permalink: link }, function (err, company) {
      if (err) {
        return done(err);
      }

      // Initialize empty profile object
      var profile = {};

      // Populate profile with original user.profile
      for (var k in company.profile) {
        profile[k] = company.profile[k];
      }

      // Update the changes from the form
      for (var k in form) {
        profile[k] = form[k];
      }

      // Update profile
      company.profile = profile;

      // Save & redirect to updated profile
      company.save(cb());
    })
  },

  // Edit company metric information
  editMetrics: function(link, form, cb) {
    Companies.findOne({ permalink: link }, function (err, company) {
      if (err)  return done(err);

      // Iterate through form fields
      for(var field in form) {

        if(typeof(company.operational[field]) !== 'undefined') {
          company.operational[field].unshift({
            time: new Date(),
            value: form[field]
          });
        }

        if(typeof(company.user_metrics[field]) !== 'undefined') {
          company.user_metrics[field].unshift({
            time: new Date(),
            value: form[field]
          });
        }

        if(typeof(company.economics[field]) !== 'undefined') {
          company.economics[field].unshift({
            time: new Date(),
            value: form[field]
          }); 
        }      
      }

      // Save & redirect to updated profile
      company.save(cb());
    });
  },

  Companies: Companies,
  passport: passport
}