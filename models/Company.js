// requires (auth)
var passport = require('passport');
var mongoose = require('mongoose/');
mongoose.connect('mongodb://localhost/test');
var api_mgr = require('../routes/apiManager');

// var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var CompanySchema = new Schema({
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
    });
var Company = mongoose.model('companies', CompanySchema);


function obj_arr_to_str(p, obj) {
  var str = '';  // start with empty string

  // if the obj is defined, concatenate each of its children's names
  if (p.relationships[obj]) {

    for (var i = 0; i < p.relationships[obj].items.length; i++) {
      // concatenate comma to front unless it's 0th
      if (i != 0) str += ', ';
      // concatenate name
      str += p.relationships[obj].items[i].name;
    }
    // return resulting string
    return str; 

  // if obj is not defined, return 'undefined'
  } else {
    return undefined;
  }
}


function usd(num) {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function add(username, password, init_investmt_date, crunchbase_permalink, owners, cb) {
  if (crunchbase_permalink == '')     crunchbase_permalink = 'NO_PERMALINK_SELECTED';
  var permalink = '';

  api_mgr.get_cmpny(crunchbase_permalink, function(body) {
    // TODO what if p or p.data is undefined?

    var p = JSON.parse(body).data;  // parse data from crunchbase response
    var profile = {};  // create empty profile to be saved into the new company

    // Crunchbase request returns successfully with complete profile
    if (p.response) {
      // there is a valid crunchbase permalink, so use that
      permalink = crunchbase_permalink;

      // build profile to be saved
      profile = { 
        img_path:      (p.relationships.primary_image) ? "http://images.crunchbase.com/" + p.relationships.primary_image.items[0].path : undefined,
        short_descrip: p.properties.short_description,
        description:   p.properties.description,
        homepage_url:  (p.properties.homepage_url) ? p.properties.homepage_url.replace('http://', '') : undefined,
        founded_on:    p.properties.founded_on,
        total_funding: (p.properties.total_funding_usd) ? usd(p.properties.total_funding_usd) : undefined,
        founders:      obj_arr_to_str(p, 'founders'), // comma-separated string of founders' names
        categories:    obj_arr_to_str(p, 'categories') // comma-separated string of categories
      };

    // Crunchbase request returned empty
    } else {
      // with no crunchbase permalink, we have to make our own
      if (username)   permalink = username.replace(/\s+/g, '-').toLowerCase();
    }

    // Create new company with profile info included
    var company = new Company({ 
      'username': username,
      'password': password, 
      'init_investmt_date': init_investmt_date,
      'crunchbase_permalink': crunchbase_permalink,
      'crunchbase_prof': p,
      'owners': owners,
      'profile': profile,
      'permalink': permalink
    });

    // Save that company & execute callback
    company.save(function (err) {
      if (err)  return done(err);
      cb();
    });

  });
}


/*
function update(u_param, orig_profile, updates, callback) {
  Company.findOne({ username: u_param }, function (err, user) {
    if (err)  return done(err);

    var profile = {};
    // populate profile with original user.profile
    for (var k in orig_profile)  profile[k] = orig_profile[k];
    // update the changes from the form
    for (var k in updates)      profile[k] = updates[k];
    
    callback(profile);

    // save & redirect to updated profile
    user.save(function() { res.redirect('/portfolio/' + u_param); });
  });
}
*/


module.exports.add = add;
// module.exports.update = update;
module.exports.passport = passport;
module.exports.CompanyDetails = Company;
