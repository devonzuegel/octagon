var passport = require('passport');
var mongoose = require('mongoose/');
// mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;
var OwnerSchema = new Schema({
    name: {
      first: String,
      last: String
    },
    companies: 'object'
  }, 
  {
    collection: 'owners'
  });
var Owner = mongoose.model('owners', OwnerSchema);


function add(name, companies) {
  // Create new company with profile info included
  var owner = new Owner({ 
    'name': name,
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
