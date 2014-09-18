var Data = {

  // Initialize elements, values, and click events
  init: function() {

    this.data = new Array([]);

    $('.data-bottom-bar .page-tab:first-child').addClass('active');

    this.elements = {
      data: $('#data'),
      companies: $('.data-bottom-bar .page-tab'),
      selectedCompany: $('.data-bottom-bar .active'),
      save: $('.save-btn'),
      download: $('.download-btn')
    };

    this.values = {
      company: this.elements.selectedCompany.text(),
      permalink: ''
    };

    this.updateData(this.values.company);

    this.elements.companies.on('click', this.changeActive);
    this.elements.save.on('click', this.saveData);
    this.elements.download.on('click', this.downloadData);
  },

  // Save data
  saveData: function() {
    // $.ajax({
    //   url: '/portfolio/' + Data.values.permalink + '/editMetrics',
    //   data: { 'data': Data.data },
    //   dataType: 'json',
    //   type: 'POST',
    //   success: function (res) {

    //   },
    //   error: function () {

    //   }
    // });
  },

  // Download data
  downloadData: function() {

    var data = Data.data,
        csvContent = 'data:text/csv;charset=utf-8,';

    data.forEach(function(infoArray, index){

       dataString = infoArray.join(',');
       csvContent += index < infoArray.length ? dataString+ '\n' : dataString;

    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  },

  // Change active company tab
  changeActive: function() {
    Data.elements.companies.removeClass('active');
    $(this).addClass('active');

    Data.updateData($(this).text());
  },

  // Update the data table
  updateData: function(company) {

    if(typeof companies !== 'undefined') {

      Data.data = new Array([]);

      var colHeaders = [],
          rowHeaders = [];

      var minRows = 4 * (moment().year() - 2010),
          minCols = Object.keys(companies[1].operational).length +
                    Object.keys(companies[1].user_metrics).length +
                    Object.keys(companies[1].economics).length;

      var q_counter = 0;
      for(var counter = 0; counter < minRows; counter++) {
        Data.data.push(new Array(minCols));
        rowHeaders.push('Q' + (4 - q_counter) + ' ' + (moment().year() - Math.floor(counter / 4)));

        if(q_counter < 3) {
          q_counter++;
        } else {
          q_counter = 0;
        }
      }

      var i = 0;
      for(var c in companies) {
        if(companies[c].username == company) {

          Data.values.permalink = companies[c].permalink;

          var p;
          for(p in companies[c].operational) {

            colHeaders.push(p);

            for(var o in companies[c].operational[p]) {

              var entry = companies[c].operational[p][o],
                  row = 4 * (moment().year() - moment(entry.date).year()) +
                  (4 - moment(entry.date).quarter());

              Data.data[row][i] = entry.value;
            }
            i++;
          }

          for(p in companies[c].user_metrics) {

            colHeaders.push(p);

            for(var o in companies[c].user_metrics[p]) {

              var entry = companies[c].user_metrics[p][o],
                  row = 4 * (moment().year() - moment(entry.date).year()) +
                        (4 - moment(entry.date).quarter());

              Data.data[row][i] = entry.value;
            }
            i++;
          }

          for(p in companies[c].economics) {

            colHeaders.push(p);

            for(var o in companies[c].economics[p]) {

              var entry = companies[c].economics[p][o],
                  row = 4 * (moment().year() - moment(entry.date).year()) +
                        (4 - moment(entry.date).quarter());

              Data.data[row][i] = entry.value;
            }
            i++;
          }
        }
      }

      $(Data.elements.data).handsontable({
        data: Data.data,
        height: window.innerHeight - (2 * 56),
        stretchH: 'all',
        minSpareRows: 1,
        minRows: minRows,
        minCols: minCols,
        colHeaders: colHeaders,
        rowHeaders: rowHeaders,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        contextMenu: false,
        readOnly: true
      });
    }
  }
};
