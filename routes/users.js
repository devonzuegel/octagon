var express = require('express');
var router = express.Router();

// require (authentication stuff)
var UserModel = require('../models/User.js'),
    passport = UserModel.passport,
    LocalStrategy = require('passport-local').Strategy,
		UserDetails = UserModel.UserDetails;

function require_privileges(req, res, include_msgs, fn) {
  if (req.isAuthenticated() && req.session.is_admin) {
    fn(req, res);
  } else {
    if (include_msgs)   req.flash('error', 'You do not have permission to perform that action.');
    if (!req.isAuthenticated()) res.redirect('../login');
    else {
      console.log('lkkjlskadjf');
     res.redirect('/user/' + req.session.username);}
  }
}

router.get('/', function(req, res) {
  // console.log("\nreq.isAuthenticated = %s", req.isAuthenticated());
  // console.log("           req.user = %j \n", req.user);
  require_privileges(req, res, true, function() {
    UserDetails.find({}, function(err, all_users) {
      if (err)    return done(err);
      res.render('all_users', { title: 'Portfolio companies:', 
                                errors: req.flash('error'),
                                companies: all_users  });
    });
  });
  // if (!UserModel.has_privileges(req, true)) {
    //   res.cookie('errors', ['You do not have permission to perform that action.']);
    //   return res.redirect('../login');
    // }

    // if (req.cookies.username != 'admin') {
    //   res.cookie('errors', ['You do not have permission to perform that action.']);
    //   return res.redirect('../login');
    // }
});


// add_user methods
  router.get('/add_user', function(req, res) {
    // only the admin may add a user
    if (req.session.username != 'admin') {
      req.flash('error', 'You do not have permission to perform that action.');
      // require_privileges();
      return res.redirect('../login');
    } else {
      res.render('add_user', {title:"Add user", errors: null});
    }
  });

  function username_inuse(u) {
    return (u == 'add_user' ||  u == 'all');//  ||  
    // var u = UserDetails.findOne({ 'username': username, }, 
    //                             function(err, user) { return (!err  &&  user);  });
    // console.log("\n\nu= %j\n\n", u);
  }

  router.post('/add_user', function(req, res) {
    console.log("\nreq.isAuthenticated = %s", req.isAuthenticated());
    console.log("           req.user = %j \n", req.user);

    if (req.body.password2 != req.body.password) {
      res.cookie('errors', ["Please make sure your passwords match."]);
      return res.redirect('/users/add_user');
    }

    if (username_inuse(req.body.username)) {
      res.cookie('errors', ["That username is already in use."]);
      return res.redirect('/users/add_user');      
    }

    UserDetails.find({'username': req.body.username }, function(err, u) {
      if (err)    return done(err);
      // console.log('u.username= %s', u.username);
      UserModel.addUser(req.body.username, req.body.password);
      res.redirect('../login');
    });
  /*  UserModel.printAll(); // prints all User data
      // console.log('username_inuse(username)= ' + username_inuse(username));
      // if (username_inuse('a')) {
      //  console.log('INUSE');
      //  res.cookie('errors', ['That username has already been used, sorry!']);
      //  return res.redirect('/register');
      // } else {
    
          // bcrypt.genSalt(10, function(err, salt) {
          // bcrypt.hash('k', salt, function(err, hash) {
            // console.log('hash:' + hash);

            // var query = UserDetails.findOne({ 'username': 'Ghost' });
            // // execute the query at a later time
            // query.exec(function (err, u) {
            //  if (err) return handleError(err);
            //   console.log('%s %s is a %s.', u.name.first, u.name.last, u.occupation) // Space Ghost is a talk show host.
            // })
     */

              // var users = u; //JSON.stringify(eval("(" + u + ")"));
              // console.log('---\nusers= %s\nreq.body.username= %s', u, req.body.username);
        //       if (u !== '[]')  {
                // console.log('users.username !== undefined');
                // res.cookie('errors', ['That username has already been used, sorry!']);
                // return res.redirect('/register');  
              // } else {
                // console.log('users.username === undefined');
                // // UserModel.salt_fn(pw);
              // }

        // });
      // });
    // }
  });

router.get('/:username', function(req, res) {
  console.log("req.user = %j \n", req.user);
  var u_param = req.params.username; // gets :username from the url
  var u_session = req.session.username;
  console.log('u_session: %s,  u_param: %s -----------', u_session, u_param);

  // if current user doesn't have the right privileges, redirect to login page w/ errors
  if (u_param != u_session  &&  u_session != 'admin') {
    req.flash('error', 'You do not have the right permissions to perform that action.')
    // console.log('req.isAuthenticated() = ' + req.isAuthenticated());
    if (req.isAuthenticated())  res.redirect('/users/u_session');
  	else                        return res.redirect('/login');
  }

  UserDetails.findOne({ 'username': u_param, }, function(err, user) {
  	if (err)    return done(err);

  	if (user != null) {
  		return res.render('users', {username: u_param, errors: req.flash('error')});
  	} else {
      req.flash('error', 'That company doesn\'t exist! Here are your options:.')
  		return res.redirect('/users');
  	}
  });
  
});


module.exports = router;
module.exports.require_privileges = require_privileges;