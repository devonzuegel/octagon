var EARLIEST_YR = 1990;
var MIN_ROWS = 4 * (moment().year() - EARLIEST_YR);
var N_COLS = 15;

// Takes (1) the array of all companies and (2) a specific company
// Adds the category name to columnHeaders
function col_headers(companies) {
  var colHeaders = [];

  // Fill in category names from Operational section
  for (var p in companies[0].operational) {
    colHeaders.push(p);
  }

  // Fill in category names from User Metrics section
  for (var p in companies[0].user_metrics) {
    colHeaders.push(p);
  }

  // Fill in category names from User Metrics section
  for (var p in companies[0].economics) {
    colHeaders.push(p);
  }

  return colHeaders;
}

function calc_row(datum) {
  var date = datum.date;
  
  console.log('\ndatum:');
  console.log(JSON.stringify(datum));
  
  console.log('\nmoment(date):');
  console.log(moment(date));

  console.log('\nmoment(date, \'Q-YYYY\')')
  console.log(moment(date, 'Q-YYYY'));
  console.log(moment(date, 'Q-YYYY').year());
  console.log(moment(date, 'Q-YYYY').quarter());
  return 4*(moment().year() - moment(date).year())  +  (4 - moment(date).quarter());
}

// Iterates thru each quarter to be represented
// Push quarter name (ex: 'Q1 2013') onto rowHeaders
function row_headers(minRows) {
  var rowHeaders = [],
      q_counter = 0;

  for(var counter = 0; counter <= MIN_ROWS; counter++) {
    // Push quarter name (ex: 'Q1 2013') onto rowHeaders
    rowHeaders.push('Q' + (4 - q_counter) + ' ' + (moment().year() - Math.floor(counter / 4)));

    // Update q_counter to next quarter
    // If we've hit 3, go back down to 0 (only want 0, 1, 2, 3)
    q_counter = (q_counter < 3) ? q_counter + 1 : 0;
  }
  return rowHeaders;
}

function populate_data(company, data, col_headers) {
  // var categories = [];
  var i = 0;
  var sections = ['operational', 'user_metrics', 'economics'];

  // (0) Iterate thru each header (hdr)
  for (var h in col_headers) {
    var hdr = col_headers[h];
    
    // (1) Iterate through each section to see if it contains that header (hdr)
    for (var s in sections) {
      var section = sections[s];

      if (company[section][hdr]) {
        var category = company[section][hdr];
        // categories.push(hdr);

        for(var d in category) {
          var datum = category[d];
          var row = calc_row(datum);
          console.log('\nrow:');
          console.log(JSON.stringify(row));
          console.log('\ndata:');
          console.log(JSON.stringify(data));
          data[row][i] = datum.value;
        }

        // increment the column in which to place the datum
        i++;
      }
    }
    // (1) END each section
  }
  // (0) END each header

  return data;
}

var Data = {

  // Initialize elements, values, and click events
  init: function() {

    this.data = new Array([]);
    this.col_headers = col_headers(companies);
    this.row_headers = row_headers(MIN_ROWS);

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

    removeExtraCols = function(old_data, num_col_hdrs) {
      var new_data = [];
      old_data.forEach(function(old_row, num_col_hdrs) {
        var new_row = old_row.slice(0, 15);
        new_data.push(new_row);
      });

      return new_data;
    };
    
    var new_data = removeExtraCols(Data.data, N_COLS);

    $.post('/portfolio/' + Data.values.permalink + '/editSpreadsheet', {
      col_headers: this.col_headers,
      data: JSON.stringify(new_data), // stringify data to pass around w/o corruption
      row_headers: this.row_headers,
    }, function(data) { });

  },

  // Download data
  downloadData: function() {

    var data = Data.data;
    var csvContent = 'data:text/csv;charset=utf-8,';

    // console.log(data);

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

    var company_name = $(this).text();
    Data.values.company = company_name;
    Data.updateData(company_name);
  },

  // Update the data table
  updateData: function(company) {
    if(typeof companies !== 'undefined'  &&  companies.length > 1) {

      // Min # of columns required to hold all categories
      var minCols = Object.keys(companies[1].operational).length +
                    Object.keys(companies[1].user_metrics).length +
                    Object.keys(companies[1].economics).length;

      // Initialize array to hold rows, represented by subarrays
      // Then, iterates thru each quarter to be represented
      // Fills Data.data with empty rows
      // Each row represents a quarter's data
      // Each row has minCols # of indices to fit each category
      Data.data = new Array([]);
      for(var counter = 0; counter < MIN_ROWS; counter++) {
        Data.data.push(new Array());
      }

      for(var c_index in companies) {
        // console.log(companies[c_index]);
        if(companies[c_index].username == company) {
          // Add the companies permalink into Data.values (for Data.save, later)
          Data.values.permalink = companies[c_index].permalink;

          // Populate Data.data with metrics
          Data.data = populate_data(companies[c_index], Data.data, this.col_headers);
        }
      }

      $(Data.elements.data).handsontable({
        data: Data.data,
        height: window.innerHeight - (2 * 56),
        stretchH: 'all',
        minSpareRows: 0,
        minRows: MIN_ROWS,
        minCols: minCols,
        colHeaders: this.col_headers,
        rowHeaders: this.row_headers,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        contextMenu: false,
        readOnly: false
      });
    }
  }
};
