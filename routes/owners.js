/* requires */
	// require (general)
	var express = require('express'),
			router = express.Router(),
		 	app = require('../app.js');

	// hash/crypto stuff
	var bcrypt = require('bcryptjs'),
	    salt = bcrypt.genSaltSync(10),  
	    hash = bcrypt.hashSync("B4c0/\/", salt);

	// require (authentication stuff)
	var CompanyModel = require('../models/Company.js'),
		  Companies = CompanyModel.Companies,
	     passport = CompanyModel.passport,
	     LocalStrategy = require('passport-local').Strategy,
		  privileges = require('./privileges.js');

	// require (owner stuff)
	var OwnerModel = require('../models/Owner.js'),
		  Owners = OwnerModel.Owners;


router.post('/add', function(req, res) {
	//////////////////////////////////////
	//////////////////////////////////////
	// TODO-- REQUIRE PRIVILEGES
	/////////////////////////////////////
	//////////////////////////////////////

  // grab body of form
  var form = req.body; 
  // case-insensitive query
  var query = { 'name': { $regex: '^'+form.name+'$', $options: '-i' } };

  // search for owner with same name (case insensitive query)
  Owners.find(query, cb = function(err, o) {
    if (err)    return done(err);

    // if (search returns empty) ...
    if (o.length == 0) {
      // only add a company if the search returns empty
      OwnerModel.add(
      	form.name,
      	form.email,
      	form.companies,
      	function(o) { 
	    		res.redirect('/settings/');
      	}
      );

    // ... else (search doesn't return empty)
    } else {
      // return us to portfolio page
      req.flash('error', 'An owner with that name aleady exists!');
      res.redirect('/settings/');
    }
  }); // END OF Owners.find()
  
});

router.post('/edit', function(req, res) {
	//////////////////////////////////////
	//////////////////////////////////////
	// TODO-- REQUIRE PRIVILEGES
	//////////////////////////////////////
	/////////////////////////////////////

  // grab body of form
  var form = req.body;
  // if form.companies is undefined, that means none were checked, so empty array
  if (!form.companies)	form.companies = [];

  // search for owner to update (based on id, found in hidden input element)
  Owners.findOne({ _id: form.id }, function (err, owner) {
    // update fields
    for (var k in form)  	owner[k] = form[k];

	/* after owner is added to db, update the selected companies to indicate 
	 * (s)he is one of their owners & then redirect to settings page */
    owner.save(function() {
    	res.redirect('/settings/');
    });
  })

});

module.exports = router;
module.exports.salt = salt;
module.exports.hash = hash;