var passport = require('passport');
var mongoose = require('mongoose/');

var Schema = mongoose.Schema;
var OwnerSchema = new Schema({
    name: String,
    companies: 'object',
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
  
  // Create new company with profile info included
  var owner = new Owner({ 
    'name': name,
    'email': email,
    'companies': companies
  });

  // Save that company & execute callback
  owner.save(function (err) {
    if (err)  return done(err);
    cb();
  });
}


module.exports.add = add;
// module.exports.update = update;
module.exports.Owners = Owner;
