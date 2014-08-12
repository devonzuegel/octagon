// Object literal for handling all aspects of adding a company
var addCompany = {

  // Initialize object
  init: function() {

    // Save elements references
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

    // Run on click 
    addCompany.elements.openForm.click(
      addCompany.focusFirst
    );

    // Run on focus
    addCompany.elements.form.submit(
      addCompany.validate
    );
  },

  // Focus the first input field 
  focusFirst: function() {
    setTimeout(function(){
      addCompany.elements.usernameField.focus();
    }, 0);
  },

  // Validate the form
  validate: function() {

    // Store the error tests
    var noUsername = (addCompany.elements.usernameField.val().trim() === ''),
        noPassword = (addCompany.elements.passwordField.val().trim() === ''),
        differentPasswords = (addCompany.elements.passwordField.val() !== addCompany.elements.password2Field.val());

    // Return the results of running the tests
    return addCompany.handleError(addCompany.elements.usernameErrorField, noUsername) &&
           addCompany.handleError(addCompany.elements.passwordErrorField, noPassword) &&
           addCompany.handleError(addCompany.elements.password2ErrorField, differentPasswords);
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