var Company = {

  // Initializes the company
  init: function() {

    // Stores important elements
    this.elements = {
      currentQuarter: $('.current-quarter'),
      daysRemaining: $('.days-remaining'),
      blockHeaders: $('.company-content .col-md-3 h3') 
    };

    // Calls the fn that calculates the quarter statistics
    this.calcQuarter(this.elements.currentQuarter, this.elements.daysRemaining, this.elements.blockHeaders);
  },

  // Calculates quarter time
  calcQuarter: function(e_current, e_days, e_headers) {

    // Stores days remaining until start of next quarter
    var daysRemaining = moment().startOf('quarter')
                          .add(3, 'month')
                          .diff(moment(), 'days');

    // Stores the label suffix for days remaining
    var daysLabel = (daysRemaining == 1) ? 'day' : 'days';

    // Populates the elements with the correct values
    e_current.text('Q' + moment().quarter() + ' ' + moment().year());
    e_days.text(daysRemaining + ' ' + daysLabel);
    e_headers.prepend('Q' + moment().quarter() + ' ' + moment().year() + ' ');
  }
};