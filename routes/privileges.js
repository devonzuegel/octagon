exports.require_privileges = function(req, res, include_msgs, admin_fn, user_fn) {

  // // If authenticated as ADMIN, call the admin function
  // if (req.isAuthenticated() && req.session.is_admin) {    

    admin_fn(req, res);

  // // Not authenticated as ADMIN
  // } else {

  //   // If include_msgs, flash an error
  //   if (include_msgs)
  //     req.flash('error', 'You do not have permission to perform that action.');
    
  //   // If not authenticated at all, redirect to login
  //   if (!req.isAuthenticated())
  //     res.redirect('../login');
  //   // If authenticated as a general user (not ADMIN), call user fn
  //   else
  //     user_fn(req, res);

  // }
};