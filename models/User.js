// requires (auth)
var passport = require('passport');
var mongoose = require('mongoose/');
mongoose.connect('mongodb://localhost/test');

// var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String,
      init_investmt_date: 'object',
      img_path: String
    }, {
      collection: 'userInfo'
    });
var UserDetails = mongoose.model('userInfo', UserDetail);

function addUser(username, password, init_investmt_date) {
  // console.log('----------------------')
  var a = new UserDetails({ 'username': username,'password': password, 'init_investmt_date': init_investmt_date });
  a.save(function (err) {     if (err)  console.log('ERROR');     });
  // console.log('user ' + a.username + ' has been added');
  // console.log('----------------------')
}

// function UserDetails.find(function (err, kittens) {
//   if (err) return console.error(err);
//   console.log(kittens)
// })

function printAll() {
  UserDetails.find(function (err, users) { console.log("users=  %j", users) });
}

function username_inuse(u) {
  UserDetails.find({ username: u }, function (err, users) { 
    console.log("users=  %j", users) 
  });
}

function salt_fn(pw) {
  console.log(pw + '----');
}

function find(username) {
  UserDetails.findOne({ username: username, }, function(err, user) {
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
module.exports.UserDetails = UserDetails;
module.exports.printAll = printAll;
module.exports.salt_fn = salt_fn;
module.exports.has_privileges = has_privileges;
// module.exports.username_inuse = username_inuse;