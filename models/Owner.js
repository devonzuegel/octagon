// requires (auth)
var passport = require('passport');
var mongoose = require('mongoose/');
mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;
var OwnerDetail = new Schema({
    name: {
      first: String,
      last: String
    }
    companies: 'object'
  }, {
    collection: 'ownerInfo'
  });
var OwnerDetails = mongoose.model('ownerInfo', OwnerDetail);

function obj_arr_to_str(p, obj) {
  if (p.relationships[obj]) {
    var str = '';
    for (var i = 0; i < p.relationships[obj].items.length; i++) {
      if (i != 0) str += ', ';
      str += p.relationships[obj].items[i].name;
    }
    return (str == '') ? undefined : str;
  }
}

function add(username, password, init_investmt_date, crunchbase_permalink, owners, callback) {
  if (crunchbase_permalink == '')     crunchbase_permalink = 'NO_PERMALINK_SELECTED';
  var permalink = '';

  api_mgr.get_cmpny(crunchbase_permalink, function(body) {
    // TODO what if p or p.data is undefined?

    var p = JSON.parse(body).data; // parse data from crunchbase response
    var profile = {}; // create empty profile to be saved into the new company

    if (p.response != false) {
      permalink = crunchbase_permalink; // there is a valid crunchbase permalink
      profile = { 
        img_path:       (p.relationships.primary_image) ? "http://images.crunchbase.com/" + p.relationships.primary_image.items[0].path : undefined,
        short_descrip:  p.properties.short_description,
        description:    p.properties.description,
        homepage_url:   (p.properties.homepage_url) ? p.properties.homepage_url.replace('http://', '') : undefined,
        founded_on:     p.properties.founded_on,
        total_funding:  (p.properties.total_funding_usd) ? p.properties.total_funding_usd.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : undefined,
        founders:       obj_arr_to_str(p, 'founders'), // build comma-separated string of founders' names
        categories:     obj_arr_to_str(p, 'categories') // build comma-separated string of categories
      };
    } else { // with no crunchbase permalink, we have to make our own
      if (username)   permalink = username.replace(/\s+/g, '-').toLowerCase();
    }

    var c = new OwnerDetails({ 
      'username': username,
      'password': password, 
      'init_investmt_date': init_investmt_date,
      'crunchbase_permalink': crunchbase_permalink,
      'crunchbase_prof': p,
      'owners': owners,
      'profile': profile,
      'permalink': permalink
    });

    c.save(function (err) {
      if (err)  console.log('ERROR');
      callback();
    });

  });
}

// function update(u_param, orig_profile, updates, callback) {
//   OwnerDetails.findOne({ username: u_param }, function (err, user) {
//     if (err)  return done(err);

//     var profile = {};
//     // populate profile with original user.profile
//     for (var k in orig_profile)  profile[k] = orig_profile[k];
//     // update the changes from the form
//     for (var k in updates)      profile[k] = updates[k];
    
//     callback(profile);

//     // save & redirect to updated profile
//     user.save(function() { res.redirect('/portfolio/' + u_param); });
//   });
// }

function username_inuse(u) {
  OwnerDetails.find({ username: u }, function (err, users) { 
    console.log("users=  %j", users) 
  });
}

function salt_fn(pw) {
  console.log(pw + '----');
}

function find(username) {
  OwnerDetails.findOne({ username: username, }, 
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

function test(x) {
  console.log(x);
}

module.exports.add = add;
// module.exports.update = update;
module.exports.test = test;
module.exports.passport = passport;
module.exports.OwnerDetails = OwnerDetails;
module.exports.salt_fn = salt_fn;
module.exports.has_privileges = has_privileges;
// module.exports.username_inuse = username_inuse;