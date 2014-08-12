exports.require_privileges = function require_privileges(req, res, include_msgs, admin_fn, user_fn) {
  if (req.isAuthenticated() && req.session.is_admin) {
    admin_fn(req, res);
  } else {
    if (include_msgs) {
      req.flash('error', 'You do not have permission to perform that action.');
    }
    if (!req.isAuthenticated()) {
      res.redirect('../login');
    } else {
      user_fn(req, res);
    }
  }
}