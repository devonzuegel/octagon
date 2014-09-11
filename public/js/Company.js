var Company = {

  // Initializes the company
  init: function() {

    // Stores important elements
    this.elements = {
      currentQuarter: $('.current-quarter'),
      daysRemaining: $('.days-remaining'),
      blockHeaders: $('.company-content .col-md-3 h3'),
      tableAdds: $('.col-md-2 .edit-btn'),
      tableEdits: $('.table-section .edit-btn'),
      graphRadios: $('.block-control input'),
      quarterMetrics: $('.table-section')
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

    // Handles the graph layout change radio buttons
    this.elements.graphRadios.on('click', this.changeGraphLayout);

    // Highlights the last quarter metrics
    this.highlightQuarter(this.elements.quarterMetrics);
  },

  // Highlights any metrics that belong to the last quarter
  highlightQuarter: function(elems) {
    elems.each(function() {
      var el_quarter = $(this).find('.date').text(),
          quarter = 'Q' + moment().subtract(3, 'M').format('Q YYYY');

      if (el_quarter == quarter) {
        $(this).addClass('highlighted-section');
      }
    });
  },

  // Clears preloaded edit values from the form
  clearFormValues: function() {
    var modal_id = $(this).attr('data-target'),
        title = $(modal_id).find('.modal-title');

    // Empty all text inputs
    $(modal_id + ' input[type=text]').val('');

    // Set quarter and year as read-only
    $(modal_id + ' input[name=quarter]').prop('readonly', false);
    $(modal_id + ' input[name=year]').prop('readonly', false);

    // Change title to 'Add'
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
                    .substring(3, parent.find('.date').text().length);

    // Populates modal form with saved values
    $(modal_id + ' input[type=text][name!=form_name][name!=quarter][name!=year]').val(value);
    $(modal_id + ' input[name=quarter]').val(quarter);
    $(modal_id + ' input[name=year]').val(year);

    // Set quarter and year as read-only
    $(modal_id + ' input[name=quarter]').prop('readonly', true);
    $(modal_id + ' input[name=year]').prop('readonly', true);

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
                          .diff(moment(), 'days');

    // Stores the label suffix for days remaining
    var daysLabel = (daysRemaining == 1) ? 'day' : 'days';

    // Populates the elements with the correct values
    e_current.text('Q' + moment().quarter() + ' ' + moment().year());
    e_days.text(daysRemaining + ' ' + daysLabel);
  },

  // Handle changing the graph's layout with radio buttons
  changeGraphLayout: function() {

      /* Store the graph name (stored in the input's name attr)
       * grab the graph object and find it's data fields */
      var graph_name = window[$(this).attr('name')],
          data = graph_name.data.xs;

      /* Depending on the radio layout chosen, transform the
       * graph's layout
       * prop = data property */
      for(var prop in data) {
        graph_name.transform($(this).val(), prop);
      }
  }
};