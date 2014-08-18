var Company = {

  init: function() {

    this.elements = {
      currentQuarter: $('#current-quarter'),
      daysRemaining: $('#days-remaining') 
    };

    this.calcQuarter(this.elements.currentQuarter, this.elements.daysRemaining);
  },

  calcQuarter: function(e_current, e_days) {

    var date = new Date(),
        quarter = Math.floor(date.getMonth() / 3) + 1;

    if(quarter == 4) {
      
    }

    e_current.text('Q' + quarter + ' ' + date.getFullYear());
  }
};