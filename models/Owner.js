var passport = require('passport'),
    mongoose = require('mongoose/'),

    CompanyModel = require('../models/Company.js'),
    Companies = CompanyModel.Companies,
    Schema = mongoose.Schema,

    OwnerSchema = new Schema({
      name: String,
      companies: 'object',
      class_name: String,
      email: String,
      img_path: String
    }, {
      collection: 'owners'
    }),

    Owners = mongoose.model('owners', OwnerSchema);

/* Given an owner, this function iterates through each company & checks if they
 * are on the owner's list of companies. If a company IS on the owner's list but the
 * owner IS NOT on the company's list, it adds the owner to the list. If the company
 * IS NOT on the owner's list but the owner IS on the company's, the owner is removed
 * from the company's list. */
function update_companies_owners(o) {
  var owners_companies = o.companies;

  Companies.find({}, function(err, all_companies) {

    for (var i = 0; i < all_companies.length; i++) {

      // Retrieve ith company from all_companies array for inspection
      var c = all_companies[i];

      /* Get & parse the stringified list of c's owners
       * If the list is undefined, create an empty array */
      var companys_owners = (c.owners && c.owners!='') ? JSON.parse(c.owners) : [];

      /* Info about existence/location of owner in list of company's owners
       * retrieve index of this owner in the list of c's owners */
      var i_owner = companys_owners.indexOf(o.id);

      // True if owner is in list of company's owners, else false
      var o_in_list = (i_owner != -1  ||  companys_owners == o.name);

      /* Info about existence/location of c in list of owner's companies
       * Retrieve index of this company in the list of this owner's companies */
      var i_company = owners_companies.indexOf(c.username);

      // True if company is in list of owner's company, else false
      var c_in_list = (i_company != -1  ||  owners_companies == c.username);


      /* If the company can be found in the list of the owner's companies
       * and if the owner isn't in the list of its company's owners, add it */
      if (c_in_list  &&  !o_in_list)    companys_owners.push(o.id);

      /* Else (the company can't be found in the list of the owner's companies)
       * If the owner is in the list of its company's owners, remove it */
      if (o_in_list  &&  !c_in_list)    companys_owners.splice(i_owner, 1);

      // Update c.owners to reflect changes
      c['owners'] = JSON.stringify(companys_owners);
      c.save();
    }
    
  });
}

module.exports = {
  add: function(name, email, companies, cb) {

    /* In the case that there is only one company selected, the form
     * returns us a string rather than an array. This line converts it
     * into an array of length 1. */
    if (typeof companies === 'string')  companies = [companies];
    if (companies == undefined)         companies = [];
    
    // Build up owner hash with details from above
    var owner = { 
      'name': name,
      'email': email,
      'companies': companies
    };

    // Create new company with info from owner hash
    Owners.create(owner, function (err, o) {
      if (err)  return done(err);

      /* After owner is added to db, update the selected companies to indicate 
       * (s)he is one of their owners & then redirect to settings page */
      if (o.companies) {

        /* Iterate through each company assigned to the owner and add the owner
         * to the company's list of owners.
         * NOTE: Could have used update_companies_owners() fn here, but it would
         * have done unecessary checks */
        for (var i = 0; i < o.companies.length; i++) {
          var username = o.companies[i];

          Companies.findOne({username: username}, function(err, c) {
            var owners = (c.owners) ? JSON.parse(c.owners) : [];
            owners.push(o.id);
            c['owners'] = JSON.stringify(owners);
            c.save();
          });
        }
        cb(o);
      }
    });
  },


  edit: function(id, form, cb) {
    // Search for owner to update (based on id, found in hidden input element)
    Owners.findOne({ _id: id }, function (err, o) {
      // Update fields
      for (var k in form)   o[k] = form[k];

      /* After owner's companies list is updated, update companies to indicate 
       * person is(n't) one of their owners & then redirect to settings page */
      o.save(function() { 
        update_companies_owners(o);    
        cb();
      }); // END OF o.save(..)
    }); // END OF Owner.findOne(..)
  },

  Owners: Owners
}