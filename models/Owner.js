var passport = require('passport');
var mongoose = require('mongoose/');

var CompanyModel = require('../models/Company.js'),
    Companies = CompanyModel.Companies;

var Schema = mongoose.Schema;
var OwnerSchema = new Schema({
    name: String,
    companies: 'object',
    class_name: String,
    email: String,
    img_path: String
  }, 
  {
    collection: 'owners'
  });
var Owner = mongoose.model('owners', OwnerSchema);


function add(name, email, companies, cb) {

  /* In the case that there is only one company selected, the form
   * returns us a string rather than an array. This line converts it
   * into an array of length 1. */
  if (typeof companies === 'string')  companies = [companies];
  
  // build up owner hash with details from above
  var owner = { 
    'name': name,
    'email': email,
    'companies': companies
  };

  // Create new company with info from owner hash
  Owner.create(owner, function (err, o) {
    if (err)  return done(err);

    /* after owner is added to db, update the selected companies to indicate 
     * (s)he is one of their owners & then redirect to settings page */
    for (var i = 0; i < o.companies.length; i++) {
      var username = o.companies[i];

      Companies.findOne({username: username}, function(err, c) {
        var owners = (c.owners) ? JSON.parse(c.owners) : [];
        owners.push(o.id);
        c['owners'] = JSON.stringify(owners);
        c.save();
      });
    }

    cb(o);
  });
}


module.exports.add = add;
// module.exports.update = update;
module.exports.Owners = Owner;
