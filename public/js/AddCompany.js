var AddCompany = {

  // Initialize object
  init: function() {

    // Save elements references
    this.elements = {
      openForm: $('#add-company-btn'),
      form: $('#add-company-form'),
      usernameField: $('#username'),
      usernameErrorField: $('#username-error div'),
      passwordField: $('#password'),
      passwordErrorField: $('#password-error div'),
      password2Field: $('#password2'),
      password2ErrorField: $('#password2-error div'),
    };

    // Run on click 
    this.elements.openForm.click(
      this.focusFirst
    );

    // Run on focus
    this.elements.form.submit(
      this.validate
    );
  },

  // Focus the first input field 
  focusFirst: function() {
    setTimeout(function(){
      AddCompany.elements.usernameField.focus();
    }, 0);
  },

  // Validate the form
  validate: function() {

    // Store the error tests
    var noUsername = (AddCompany.elements.usernameField.val().trim() === ''),
        noPassword = (AddCompany.elements.passwordField.val().trim() === ''),
        differentPasswords = (AddCompany.elements.passwordField.val() !== AddCompany.elements.password2Field.val());

    // Return the results of running the tests
    return AddCompany.handleError(AddCompany.elements.usernameErrorField, noUsername) &&
           AddCompany.handleError(AddCompany.elements.passwordErrorField, noPassword) &&
           AddCompany.handleError(AddCompany.elements.password2ErrorField, differentPasswords);
  },

  // Given an error, handle the display of error fields
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