var addCompany = {

  init: function() {
    addCompany.elements = {
      openForm: $('#add-company-btn'),
      form: $('#add-company-form'),
      usernameField: $('#username'),
      usernameErrorField: $('#username-error div'),
      passwordField: $('#password'),
      passwordErrorField: $('#password-error div'),
      password2Field: $('#password2'),
      password2ErrorField: $('#password2-error div'),
    };

    addCompany.elements.openForm.click(
      addCompany.focus
    );

    addCompany.elements.form.submit(
      addCompany.validate
    );
  },

  focus: function() {
    setTimeout(function(){
      addCompany.elements.usernameField.focus();
    }, 0);
  },

  validate: function() {
    var noUsername = (addCompany.elements.usernameField.val().trim() === ''),
        noPassword = (addCompany.elements.passwordField.val().trim() === ''),
        differentPasswords = (addCompany.elements.passwordField.val() !== addCompany.elements.password2Field.val());


    return addCompany.handleError(addCompany.elements.usernameErrorField, noUsername) &&
           addCompany.handleError(addCompany.elements.passwordErrorField, noPassword) &&
           addCompany.handleError(addCompany.elements.password2ErrorField, differentPasswords);
  },

  handleError: function(error_field, error) {
    if(error) {
      error_field.show();
      return false;
    } else {
      error_field.hide();
      return true;
    }
  }
};