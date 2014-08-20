var Company = {

  // Initializes the company
  init: function() {

    // Stores important elements
    this.elements = {
      currentQuarter: $('.current-quarter'),
      daysRemaining: $('.days-remaining'),
      blockHeaders: $('.company-content .col-md-3 h3'),
      tableAdds: $('.col-md-3 .edit-btn'),
      tableEdits: $('.table-section .edit-btn'),
    };

    // Calls the fn that calculates the quarter statistics
    this.calcQuarterInfo(
      this.elements.currentQuarter,
      this.elements.daysRemaining,
      this.elements.blockHeaders);

    // Clears and populates form values depending on whether
    // adding or editing
    this.elements.tableAdds.on('click', this.clearFormValues);
    this.elements.tableEdits.on('click', this.populateFormValues);
  },

  // Clears preloaded edit values from the form
  clearFormValues: function() {
    var modal_id = $(this).attr('data-target'),
        title = $(modal_id).find('.modal-title');

    $(modal_id + ' input[type=text]').val('');
      // .prop('readonly', false);

    // Change title to 'Add'...
    title.text('Add');
  },

  // Preloads default values into the edit form
  populateFormValues: function() { 

    // Saves important values from edit region
    var modal_id = $(this).attr('data-target'),
        parent = $(this).parent(),
        title = $(modal_id).find('.modal-title'),
        value = parent.find('.value')
                  .text()
                  .substring(1, parent.find('.value').text().length - 3),
        quarter = parent.find('.date')
                    .text()
                    .substring(1, 2),
        year = parent.find('.date')
                    .text()
                    .substring(3, parent.find('.date').text().length)

    // Populates modal form with saved values
    $(modal_id + ' input[type=text][name!=form_name][name!=date][name!=year]').val(value);
    $(modal_id + ' input[name=date]').val(quarter);
      // .prop('readonly', true);
    $(modal_id + ' input[name=year]').val(year);
      // .prop('readonly', true);

    // Change title to 'Edit'...
    title.text('Edit');
  },

  // Returns the current quarter
  getQuarter: function() {
    return moment().quarter();
  },

  // Calculates quarter related info
  calcQuarterInfo: function(e_current, e_days, e_headers) {

    // Stores days remaining until start of next quarter
    var daysRemaining = moment().startOf('quarter')
                          .add(3, 'month')
                          .diff(moment(), 'days'),

        // Previous quarter
        // prevQuarter = moment()
        //                 .subtract(3, 'month')
        //                 .quarter(),

        // Year of the previous quarter
        // yearOfPrevQuarter = (prevQuarter === 4) ?
        //                     moment().year() - 1 :
        //                     moment().year(),

        // Stores the label suffix for days remaining
        daysLabel = (daysRemaining == 1) ? 'day' : 'days';

    // Populates the elements with the correct values
    e_current.text('Q' + moment().quarter() + ' ' + moment().year());
    e_days.text(daysRemaining + ' ' + daysLabel);
  }
};