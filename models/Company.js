// Requires
var passport = require('passport'),
    mongoose = require('mongoose/'),
    api_mgr = require('../routes/apiManager');

// Bcrypt / password hashing stuff
var bcrypt = require('bcrypt'),
    // Generate a salt
    salt = bcrypt.genSaltSync(10),
    // Hash the password with the salt
    hash = bcrypt.hashSync("my password", salt);

  // Finally just store the hash in your DB
  // .. code to store in Redis/Mongo/Mysql/Sqlite/Postgres/etc.

mongoose.connect('mongodb://localhost/test');

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
      operational: {
        gross_burn: ['object'],
        net_burn: ['object'],
        revenue: ['object'],
        head_count: ['object']
      },
      user_metrics: {
        avg_dau: ['object'],
        avg_mau: ['object'],
        churn: ['object']
      },
      economics: {
        ltv: ['object'],
        lifetime_est: ['object'],
        cac: ['object'],
        asp: ['object'],
        gm_percentage: ['object']
      }
    }, {
      collection: 'companies'
    }),
    Companies = mongoose.model('companies', CompanySchema);


//// HELPERS /////

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
    // Replace all occurances of links with text format & return new description
    return description.replace(link, '$1');
  }

  /* Function for transforming object arrays to strings */
  function objArrayToString(p, obj) {
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
  function simplifyCrunchbaseProf(p) {
    return simplified_p = { 
      img_path:      (p.relationships.primary_image) ?
                     "http://images.crunchbase.com/" + 
                     p.relationships.primary_image.items[0].path :
                     undefined,
      short_descrip: p.properties.short_description,
      description:   (p.properties.description) ? 
                     shorten(findLinks(p.properties.description)) :
                     undefined,
      homepage_url:  (p.properties.homepage_url) ?
                     p.properties.homepage_url.replace('http://', '') :
                     undefined,
      founded_on:    p.properties.founded_on,
      total_funding: (p.properties.total_funding_usd) ?
                     usd(p.properties.total_funding_usd) :
                     undefined,

      // Comma-separated string of founders' names
      founders:      objArrayToString(p, 'founders'),

      // Comma-separated string of categories
      categories:    objArrayToString(p, 'categories')
    };
  }


//// EXPORTS /////

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
        profile = simplifyCrunchbaseProf(p);

      // Else if crunchbase request returned empty
      } else if (username) { 
        // Create own permalink
        permalink = username.replace(/\s+/g, '-').toLowerCase();
      }

      bcrypt.hash(password, 10, function(err, hash) {
        // Build up company hash with details from above
        var company = { 
          'username': username,
          'password': hash, 
          'init_investmt_date': init_investmt_date,
          'crunchbase_permalink': crunchbase_permalink,
          'crunchbase_prof': p,
          'owners': owners,
          'profile': profile,
          'permalink': permalink,
          'operational': { 
            gross_burn: [], 
            net_burn: [], 
            revenue: [], 
            head_count: []
          },
          'user_metrics': { 
            avg_dau: [], 
            avg_mau: [], 
            churn: []
          },
          'economics': { 
            ltv: [], 
            lifetime_est: [], 
            cac: [], 
            asp: [], 
            gm_percentage: []
          }
        }

        // Create new company with profile info included
        Companies.create(company, function (err, c) {
          if (err)  return done(err);
          cb(c);
        });
      });

    });
  },

  // Edit company profile information
  editProfile: function(link, form, cb) {
    Companies.findOne({ permalink: link }, function (err, company) {
      if (err)  return done(err);

      // Initialize empty profile object
      var profile = {};

      // Populate profile with original user.profile
      for (var k in company.profile)  profile[k] = company.profile[k];
      // Update the changes from the form
      for (var k in form)             profile[k] = form[k];
      
      // Update profile
      company.profile = profile;
      // Save & redirect to updated profile
      company.save(cb());
    });
  },

  // Edit company metric information
  editMetrics: function(link, form, cb) {
    /* Given the contents of a form (including a field called 'form.form_name'), 
     * this update the corresponding field in company (access by calling:
     * company[form.form.form_name]) with the contents of the form. */
    Companies.findOne({ permalink: link }, function (err, company) {

      if (err)  return done(err);

      // Initialize empty obj
      var updated = {};

      // Populate 'updated' with old values
      for (var field in company[form.form_name]) {
        updated[field] = company[form.form_name][field];
      }

      // Update fields of 'updated' with data from form
      for (var field in form) {
        // Form_name is the only input from the form that we don't include
        if (field != 'form_name') {
          // If the field doesn't exist in updated (or in the db) yet, create it
          if (updated[field] == undefined)   updated[field] = 'object';

          // Inserts obj (with timestamp & value) to beginning of array obj
          updated[field].unshift({
            timestamp: new Date(),
            value: form[field],
            label: field
          });
        }
      }

      // Update 'company[for.form.form_name]' to reflect changes from 'updated'
      company[form.form_name] = updated;
      // Save 'company' to db and call callback function
      company.save(cb);

    });
  },


  Companies: Companies,

  passport: passport,

  bcrypt: bcrypt
}