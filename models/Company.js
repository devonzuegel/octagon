// Requires
var passport = require('passport'),
    mongoose = require('mongoose/'),
    api_mgr = require('../routes/apiManager');

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
      permalink: String
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
    description:   shorten(findLinks(p.properties.description)),
    homepage_url:  (p.properties.homepage_url) ? p.properties.homepage_url.replace('http://', '') : undefined,
    founded_on:    p.properties.founded_on,
    total_funding: (p.properties.total_funding_usd) ? usd(p.properties.total_funding_usd) : undefined,

    // Comma-separated string of founders' names
    founders:      obj_arr_to_str(p, 'founders'),

    // Comma-separated string of categories
    categories:    obj_arr_to_str(p, 'categories')
  };
}

/* Add a new company */
function add(username, password, init_investmt_date, crunchbase_permalink, owners, cb) {
  if (crunchbase_permalink == '') {
    crunchbase_permalink = 'NO_PERMALINK_SELECTED';
  }

  var permalink = '';

  api_mgr.get_cmpny(crunchbase_permalink, function(body) {

    // Parse data from crunchbase response
    var p = JSON.parse(body).data;
    // Create empty profile to be saved into the new company
    var profile = {};


    /* Check that crunchbase request returns successfully with complete profile.
     * Not equivalent to (p.response == true) b/c need to ensure existence too */
    if (p.response != false) {
      // There is a valid crunchbase permalink, so use that
      permalink = crunchbase_permalink;
      // Build profile based on crunchbase to be saved
      profile = simplify_crunchbase_prof(p);

    /* Else (crunchbase request returned empty) */
    } else if (username) { 
      // With no crunchbase permalink, we have to make our own
      permalink = username.replace(/\s+/g, '-').toLowerCase();
    }


    // Build up company hash with details from above
    var company = { 
      'username': username,
      'password': password, 
      'init_investmt_date': init_investmt_date,
      'crunchbase_permalink': crunchbase_permalink,
      'crunchbase_prof': p,
      'owners': owners,
      'profile': profile,
      'permalink': permalink
    };


    // Create new company with profile info included
    Companies.create(company, function (err) {
      if (err)  return done(err);
      cb();
    });
  });
}

/* Edit company information */
function edit (link, form, cb) {
  Companies.findOne({ permalink: link }, function (err, user) {
    if (err)  return done(err);

    var profile = {};

    // Populate profile with original user.profile
    for (var k in user.profile) {
      profile[k] = user.profile[k];
    }

    // Update the changes from the form
    for (var k in form) {
      profile[k] = form[k];
    }

    // Update profile
    user['profile'] = profile;

    // Save & redirect to updated profile
    user.save(cb());
  })
}


module.exports.add = add;
module.exports.edit = edit;
module.exports.passport = passport;
module.exports.Companies = Companies;
