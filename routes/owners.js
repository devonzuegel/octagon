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
  Owners.findOne({ _id: form.id }, function (err, o) {
    // update fields
    for (var k in form)  	o[k] = form[k];

    o.save(function() {
      
      /* after owner's companies list is updated, update companies to indicate 
       * person is(n't) one of their owners & then redirect to settings page */

      var owners_companies = o.companies;

      Companies.find({}, function(error, all_companies) {
        console.log('owners_companies: ' + owners_companies);

        for (var i = 0; i < all_companies.length; i++) {
          // retrieve ith company from all_companies array for inspection
          var c = all_companies[i];

          // get & parse the stringified list of c's owners
          // if the list is undefined, create an empty array
          var companys_owners = (c.owners && c.owners!='') ? JSON.parse(c.owners) : [];

          // retrieve index of this owner in the list of c's owners
          var i_owner = companys_owners.indexOf(o.id);

          // retrieve index of this company in the list of this owner's companies
          var i_company = owners_companies.indexOf(c.username);

          // if (the company can be found in the list of the owner's companies)
          if (i_company != -1  ||  owners_companies == c.username){
            console.log('\nYES >> %s', c.username);
            console.log('companys_owners BEFORE  ' + companys_owners);

            // if the owner isn't in the list of its company's owners, add it
            if (i_owner == -1) {
              companys_owners.push(o.id);
              c['owners'] = JSON.stringify(companys_owners);
              c.save(function(err, company) {
                console.log('companys_owners AFTER   ' + company.owners);
              });
            }

          // else (the company can't be found in the list of the owner's companies)
          } else {
            console.log('\nNO  >> %s', c.username);
            console.log('companys_owners BEFORE  ' + companys_owners);

            // if the owner is in the list of its company's owners, remove it
            if (i_owner != -1) {
              companys_owners.splice(i_owner, 1);
              c['owners'] = JSON.stringify(companys_owners);
              c.save(function(err, company) {
                console.log('companys_owners AFTER   ' + company.owners);
              });
            }
          }

        }
        
      });

      // ///////////////////////////////////////////////////////////////////
      // ///////////////////////////////////////////////////////////////////
      // for (var i = 0; i < o.companies.length; i++) {
      //   var username = o.companies[i];

      //   Companies.findOne({username: username}, function(err, c) {
      //     var owners = (c.owners) ? JSON.parse(c.owners) : [];
      //     owners.push(o.id);
      //     c['owners'] = JSON.stringify(owners);
      //     c.save();
      //   });
      // }
      // ///////////////////////////////////////////////////////////////////
      // ///////////////////////////////////////////////////////////////////

    	res.redirect('/settings/');
    });
  })

});

module.exports = router;
module.exports.salt = salt;
module.exports.hash = hash;