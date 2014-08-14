exports.require_privileges = function(req, res, include_msgs, admin_fn, user_fn) {

  // // If authenticated as ADMIN, call the admin function
  // if (req.isAuthenticated() && req.session.is_admin) {    

    admin_fn(req, res);

  // // Not authenticated as ADMIN
  // } else {

  //   if (include_msgs) // If include_msgs, flash an error
  //     req.flash('error', 'You do not have permission to perform that action.');
    
  //   if (!req.isAuthenticated())  // If not authenticated at all, redirect to login
  //     res.redirect('../login');
  //   else  // If authenticated as a general user (not ADMIN), call user fn
  //     user_fn(req, res);

  // }
}