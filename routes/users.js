var express = require('express');
var router = express.Router();

// require (authentication stuff)
var UserModel = require('../models/User.js'),
    passport = UserModel.passport,
    LocalStrategy = require('passport-local').Strategy,
		UserDetails = UserModel.UserDetails;


router.get('/', function(req, res) {
  if (req.cookies.username != 'admin') {
    res.cookie('errors', ['You do not have permission to perform that action.']);
    return res.redirect('../login');
  }

  res.cookie('errors', []);
  // var companies = UserDetails.find({});
  UserDetails.find({}, {username: 1}, function(err, all_users) {
    if (err)    return done(err);
    console.log('all_users= %j', all_users);

    var i = 0;
    var data = [ {id: String(i++), ort: "Schlosskeller", name: "DnB for live", beginn: "1.11.2011, ab 22 Uhr"},
                 {id: String(i++), ort: "603qm", name: "Electro Technik", beginn: "1.11.2011, ab 22 Uhr"},
                 {id: String(i++), ort: "Krone", name: "da geht der Punk ", beginn: "1.11.2011, ab 20 Uhr"},
                 {id: String(i++), ort: "Schlosskeller", name: "Wuerstchenfest", beginn: "2.11.2011, ab 20 Uhr"},
                 {id: String(i++), ort: "Krone", name: "Karaoke", beginn: "2.11.2011, ab 21 Uhr"} ];



    res.render('all_users', { title: 'Portfolio companies:', 
                              errors: req.cookies.errors,
                              companies: all_users,
                              i: i,  data: data
    });

  });

});


// add_user methods
  router.get('/add_user', function(req, res) {
    // only the admin may add a user
    if (req.cookies.username != 'admin') {
      res.cookie('errors', ['You do not have permission to perform that action.']);
      return res.redirect('../login');
    }
    res.cookie('errors', []);
    res.render('add_user', {title:"Add user", errors: req.cookies.errors});
  });

  function username_inuse(u) {
    return (u == 'add_user' ||  u == 'all');//  ||  
    // var u = UserDetails.findOne({ 'username': username, }, 
    //                             function(err, user) { return (!err  &&  user);  });
    // console.log("\n\nu= %j\n\n", u);
  }

  router.post('/add_user', function(req, res) {
    console.log('aslfdkjsalfjaslfkjalskfjlksjaflaksjfd');
    if (req.body.password2 != req.body.password) {
      res.cookie('errors', ["Please make sure your passwords match."]);
      return res.redirect('/users/add_user');
    }

    if (username_inuse(req.body.username.toLowerCase())) {
      res.cookie('errors', ["That username is already in use."]);
      return res.redirect('/users/add_user');      
    }

    UserDetails.find({'username': req.body.username.toLowerCase() }, function(err, u) {
      if (err)    return done(err);
      // console.log('u.username= %s', u.username);
      UserModel.addUser(req.body.username.toLowerCase(), req.body.password);
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
  // var u_param = req.param('username'),
  console.log('req.params.username = %s', req.params.username);
  var u_param = req.params.username.toLowerCase();
  var u_cookie = req.cookies.username.toLowerCase();
  console.log('u_cookie: %s,  u_param: %s -----------', u_cookie, u_param);

  // if current user doesn't have the right privileges, redirect to login page w/ errors
  if (u_param != u_cookie  &&  u_cookie != 'admin') {
  	res.cookie('errors', ['You do not have the right permissions to perform that action.']);
  	return res.redirect('/login');
  }

  UserDetails.findOne({ 'username': u_param, }, function(err, user) {
  	if (err)    return done(err);

  	if (user != null) {
  		return res.render('users', {username: u_param});
  	} else {
  		res.cookie('errors', ['That company doesn\'t exist! Here are your options:']);
  		return res.redirect('/users');
  	}
  });
  
});


module.exports = router;
