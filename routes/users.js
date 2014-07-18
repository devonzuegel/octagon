var express = require('express');
var router = express.Router();
// var formidable = require('formidable');
var api_mgr = require('./apiManager');

// require (authentication stuff)
var UserModel = require('../models/User.js'),
    passport = UserModel.passport,
    LocalStrategy = require('passport-local').Strategy,
		UserDetails = UserModel.UserDetails;

function require_privileges(req, res, include_msgs, admin_fn, user_fn) {
  if (req.isAuthenticated() && req.session.is_admin) {
    admin_fn(req, res);
  } else {
    if (include_msgs)   req.flash('error', 'You do not have permission to perform that action.');
    if (!req.isAuthenticated()) res.redirect('../login');
    else    user_fn(req, res);
  }
}

router.get('/', function(req, res) {
  require_privileges(req, res, true, 
                     function() {
                          UserDetails.find({}, function(err, all_users) {
                            if (err)    return done(err);
                            res.render('all_users', { title: 'Portfolio', 
                                                      errors: req.flash('error'),
                                                      companies: all_users,
                                                      tab: 'companies',
                                                      username: req.session.username,
                                                      is_admin: true  });
                          });
                      }, function() { 
                          res.redirect('/users/' + req.session.username); 
                      }
  );
});


// add_user methods
router.get('/add_user', function(req, res) {
  require_privileges(req, res, true,
                     function() {  return;  },
                     function() {  return res.redirect('/users/' + req.session.username);  }
  );

  res.render('add_user', { title:"New Company", 
                           is_admin: true, 
                           errors: undefined,
                           username: req.session.username,
                           tab: 'companies' }
  );
});

router.post('/add_user', function(req, res) {

  var form = req.body;

  if (form.password2 != form.password) {
    res.cookie('errors', ["Please make sure your passwords match."]);
    return res.redirect('/users/add_user');
  }

  if (false/*username_inuse(form.username)*/) {
    res.cookie('errors', ["That username is already in use."]);
    return res.redirect('/users/add_user');      
  }

  UserDetails.find({'username': form.username }, function(err, u) {
    if (err)    return done(err);

    UserModel.addUser(form.username, form.password, 
                      form.init_investmt_date, 
                      form.crunchbase_permalink, 
                      function() { res.redirect('/users/'); }
                     );  
  });

});

router.get('/:username', function(req, res) {
  var u_param = req.params.username; // gets :username from the url
  if (u_param == 'add_user')    res.redirect('/users/add_user');
  var u_session = req.session.username;

  require_privileges(req, res, false, 
                     function() { return }, 
                     function() {
                          if (u_session != u_param) {
                            // req.flash('error', 'You do not have permission to perform that action.');
                            res.redirect('/users/' + u_session);
                          }
                      }
  );
  UserDetails.findOne({ 'username': u_param, }, function(err, user) {
    if (err)    return done(err);


    if (user == null  ||  u_param == 'admin') {

        req.flash('error', 'That company doesn\'t exist! Here are your options:.')
        return res.redirect('/users');

    } else {

      var body = user.crunchbase_prof;

      if (body.data.error) {
          var details = { errors: req.flash('error'),
                          username: req.session.username,
                          c: user,
                          is_admin: (u_session == 'admin'),
                          title: u_param 
                        };
          return res.render('users',  details);

      } else {
          
          var img_path = body.data.relationships.primary_image.items[0].path; // .data.relationships.primary_image.items.path
          var short_descrptn = body.data.properties.short_description;
          var description = body.data.properties.description;
          var homepage_url = body.data.properties.homepage_url.replace("http://","");

          var details = { errors: req.flash('error'),
                          username: req.session.username,
                          c: user,
                          img_path: "http://images.crunchbase.com/" + img_path,
                          short_descrptn: short_descrptn,
                          description: description,
                          homepage_url: homepage_url,
                          title: u_param,
                          is_admin: (u_session == 'admin'),
                          tab: (u_session == 'admin') ? 'companies' : ''
                        };
          return res.render('users', details);

      }


    }
  });
});


module.exports = router;
module.exports.require_privileges = require_privileges;

// owner
// monthly cash burn
// cash balance
// revenue