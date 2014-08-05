// requires (auth)
var passport = require('passport');
var mongoose = require('mongoose/');
mongoose.connect('mongodb://localhost/test');
var api_mgr = require('../routes/apiManager');

// var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var CompanyDetail = new Schema({
      username: String,
      password: String,
      init_investmt_date: 'object',
      img_path: String,
      crunchbase_permalink: String,
      crunchbase_prof: 'object',
      owners: 'object',
      profile: 'object'
    }, {
      collection: 'userInfo'
    });
var CompanyDetails = mongoose.model('userInfo', CompanyDetail);



function addUser(username, password, init_investmt_date, crunchbase_permalink, owners, callback) {
  if (crunchbase_permalink == '')   crunchbase_permalink = 'NO_PERMALINK_SELECTED';
  api_mgr.get_cmpny(crunchbase_permalink, function(body) {
    
    // TODO what if p or p.data is undefined?
    var p = JSON.parse(body).data;
    var profile = {};
    if (p.response != false) {
      profile = { 
        img_path:       (p.relationships.primary_image) ? "http://images.crunchbase.com/" + p.relationships.primary_image.items[0].path : undefined,
        short_descrip:  p.properties.short_description,
        description:    p.properties.description,
        homepage_url:   p.properties.homepage_url.replace("http://",""),
        founded_on:     p.properties.founded_on,
        total_funding:  p.properties.total_funding_usd,
        founders:       (p.relationships.founders) ? p.relationships.founders.items.toString() : undefined,
        categories:     (p.relationships.categories) ? p.relationships.categories.items : undefined,
      };
    }
    profile.username = username;

    var a = new CompanyDetails({ 
      'username': username,
      'password': password, 
      'init_investmt_date': init_investmt_date,
      'crunchbase_permalink': crunchbase_permalink,
      'crunchbase_prof': p,
      'owners': owners,
      'profile': profile
    });

    a.save(function (err) {
      if (err)  console.log('ERROR');
      callback();
    });

  });
}

function updateCompany(username, details) {
}


function printAll() {
  CompanyDetails.find(function (err, users) { console.log("users=  %j", users) });
}

function username_inuse(u) {
  CompanyDetails.find({ username: u }, function (err, users) { 
    console.log("users=  %j", users) 
  });
}

function salt_fn(pw) {
  console.log(pw + '----');
}

function find(username) {
  CompanyDetails.findOne({ username: username, }, 
                      function(err, user) {
                        if (err)    return done(err);
                        if (!user)  done(null, false);     
                        return done(null, user);
                      });

}

function has_privileges(req, admin_only){
  if (!req.isAuthenticated()) return false;
  if (!admin_only)  return true;
  return req.session.is_admin;
}

module.exports.addUser = addUser;
module.exports.passport = passport;
module.exports.CompanyDetails = CompanyDetails;
module.exports.printAll = printAll;
module.exports.salt_fn = salt_fn;
module.exports.has_privileges = has_privileges;
// module.exports.username_inuse = username_inuse;