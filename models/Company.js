// Requires
var passport = require('passport'),
    mongoose = require('mongoose/'),
    api_mgr = require('../routes/apiManager'),
    moment = require('moment');

// Bcrypt / password hashing stuff
var bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10); // Generate a salt


var MONGO_URI = 'mongodb://heroku_app28713039:aa1jom2tna3p736qs2gglg2b2o@ds063899.mongolab.com:63899/heroku_app28713039' ||
                'mongodb://localhost/test';

// Localhost connection
mongoose.connect(MONGO_URI);

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
      milestones: [
        {
          _id: String,
          title: String,
          date: Date,
          description: String
        }
      ],
      team: [
        {
          _id: String,
          full_name: String,
          img_path: String,
          role: String,
          email: String,
          date_joined: Date
        }
      ],
      operational: {
        cash: ['object'],
        gross_burn: ['object'],
        pred_gross_burn: ['object'],
        net_burn: ['object'],
        pred_net_burn: ['object'],
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


//// Helper functions /////

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
      if (i !== 0) str += ', ';
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

/* Given an id & an array, returns the index of the object
 * within the array that has the same id. */
function indexFromId (id, obj_array) {
  if (JSON.toString(obj_array) == '[object JSON]')
  for (var i = 0; i < obj_array.length; i++) {
    if (id == obj_array[i].id)       return i;
  }
}

function newData(form, field) {
  return new_data = {
    date: moment(form.quarter + '-' + form.year, 'Q-YYYY').add(1, 'day'),
    value: form[field],
    label: field,
    timestamp: moment()
  };
}


/* Simplify crunchbase profile object */
function simplifyCrunchbaseProf(p) {
  return {
    img_path:      (p.relationships.primary_image) ?
                   "http://images.crunchbase.com/" +
                   p.relationships.primary_image.items[0].path :
                   undefined,
    short_descrip: p.properties.short_description,
    description:   (p.properties.description) ?
                   findLinks(p.properties.description) :
                   undefined,
    homepage_url:  (p.properties.homepage_url) ?
                   p.properties.homepage_url.replace('http://', '') :
                   undefined,
    founded_on:    moment(Date.parse(p.properties.founded_on)).format('DD MMMM YYYY'),
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

    if (crunchbase_permalink === '') {
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
      if (p.response !== false) {

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
          'milestones': [],
          'operational': {
            cash: [],
            gross_burn: [],
            pred_gross_burn: [],
            net_burn: [],
            pred_net_burn: [],
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
        };

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

      /* CONTAINS FORM.ARRAY
       * If the form CONTAINS an 'array' field, we create an object containing
       * the values from each field. We then push that object onto the array
       * indicated by form['array']. */
      if (form.array) {
        // initialize obj to be filled w/ form data (w/ unique id for the obj)
        var obj = { _id: (new Date()).getTime()  };

        // populate obj with form data (except the value of the array field)
        for (var field in form) {
          if (field != 'array')     obj[field] = form[field];
        }
        // push obj to end of array defined by form.array, into company db document
        company[form.array].push(obj);

      /* CONTAINS FORM.EDIT_OBJ_IN_ARRAY
       * If the form CONTAINS an 'edit_obj_in_array' field, we create an object
       * containing the values from each field. We then push that object onto
       * the array indicated by form['array']. */
      } else if (form.edit_obj_in_array) {
        // save name of array to edit in shorter variable
        var array_name = form.edit_obj_in_array;

        // Find index of obj in company[array_name] with _id from form
        var i = indexFromId(form._id, company[array_name]);

        // Replace obj at company[array_name][i] with new data from form
        for (var f in form) {
          if (f != 'edit_obj_in_array')   company[array_name][i][f] = form[f];
        }

      /* UPDATE PROFILE OBJECT
       * If the form DOES NOT CONTAIN an 'array' or 'edit_obj_in_array' field,
       * we add each field directly to the profile object. */
      } else {
        var profile = {}; // Initialize empty profile object

        // Populate profile with original user.profile
        for (var field in company.profile)  profile[field] = company.profile[field];
        // Update the changes from the form
        for (field in form)             profile[field] = form[field];

        company.profile = profile; // Update profile
      }

      // Save updated profile, execute callback
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

      var updated = {}, // Initialize empty obj and
          field; // counting variable 'field'

      // Populate 'updated' with old values
      for (field in company[form.form_name]) {
        updated[field] = company[form.form_name][field];
      }

      // Update fields of 'updated' with data from form
      for (field in form) {
        // If the field is not an unintended field
        if (field !== 'form_name'  &&  field !== 'quarter'  &&   field !=='year') {

          // If the field doesn't exist in updated (or in the db) yet, create it
          if (updated[field] === undefined)   updated[field] = 'object';

          // The new data to be inserted
          /* TODO: New data should not be inserted every time, because at the moment
           * this code handles editing data as well */
          var new_data = newData(form, field);

          // Initialize quarterDataExists boolean to false
          var quarterDataExists = false;

          // Loop through entries in company property
          for(var entry in updated[field]) {
            // Necessary check for all for ... in statements
            if (updated[field].hasOwnProperty(entry)) {

              // If the data for the quarter already exists
              if(moment(updated[field][entry].date).isSame(moment(new_data.date))) {
                quarterDataExists = true;
                updated[field][entry] = new_data; // Overwrite the data
                break; // Break out of the loop
              }

            }
          }

          // Inserts data to the top of the array if it doesn't exist
          if(!quarterDataExists)    updated[field].unshift(new_data);
        }
      }

      // Update 'company[for.form.form_name]' to reflect changes from 'updated'
      company[form.form_name] = updated;
      // Save 'company' to db and call callback function
      company.save(cb);

    });
  },

  editSpreadsheet: function(permalink, data_table, col_hdrs) {
    Companies.findOne({ permalink: permalink }, function (err, company) {
      console.log(data_table);

      var sections = [ 'operational', 'user_metrics', 'economics' ];
          company_updated = company;

      for (var h in col_hdrs) {
        var hdr = col_hdrs[h];

        var updated_col = new Array(data_table.length);
        for (var i = 0; i < data_table.length; i++) {
          updated_col[i] = {
            value: data_table[i][h],
          };
        }

        for (var s in sections) {
          var section = sections[s];

          if (company_updated[section][hdr]) {
            company_updated[section][hdr] = updated_col;
          }

        }
        console.log(JSON.stringify(company));
      }
      company = company_updated;
      company.save();
    });
  },

  // Delete a data point from company metric info
  deleteDatum: function(link, form, cb) {
    /* Given the contents of a form (including a field called 'form.form_name'),
     * this delete the corresponding field in company (access by calling:
     * company[form.form.form_name]) with the contents of the form. */
    Companies.findOne({ permalink: link }, function (err, company) {

      if (err)  return done(err);

      // Initialize empty obj and a counting variable 'field'
      var updated = {},  field;

      // Populate 'updated' with old values
      for (field in company[form.form_name]) {
        updated[field] = company[form.form_name][field];
      }

      // Update fields of 'updated' with data from form
      for (field in form) {
        // If the field is not an unintented field
        if (field !== 'form_name'  &&  field !== 'quarter' &&  field !=='year') {

          // The new data to be checked for deletion
          var new_data = newData(form, field);
          // Loop through entries in company property
          for(var i = 0; i < updated[field].length; i++) {
            // If the data for the quarter already exists
            if(moment(updated[field][i].date).isSame(moment(new_data.date))) {
              updated[field].splice(i, 1);
            }
          }

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
};
