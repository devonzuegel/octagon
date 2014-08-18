var Company = {

  // Initializes the company
  init: function() {

    // Stores important elements
    this.elements = {
      currentQuarter: $('#current-quarter'),
      daysRemaining: $('#days-remaining') 
    };

    // Calls the fn that calculates the quarter statistics
    this.calcQuarter(this.elements.currentQuarter, this.elements.daysRemaining);
  },

  // Calculates quarter time
  calcQuarter: function(e_current, e_days) {

    // Stores days remaining until start of next quarter
    var daysRemaining = moment().startOf('quarter')
                          .add(3, 'month')
                          .diff(moment(), 'days');

    // Stores the label suffix for days remaining
    var daysLabel = (daysRemaining == 1) ? 'day' : 'days';

    // Populates the elements with the correct values
    e_current.text('Q' + moment().quarter() + ' ' + moment().year());
    e_days.text(daysRemaining + ' ' + daysLabel);
  }
};