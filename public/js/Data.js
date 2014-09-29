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

// Iterates thru each quarter to be represented
// Push quarter name (ex: 'Q1 2013') onto rowHeaders
function row_headers(minRows) {
  var rowHeaders = [],
      q_counter = 0;

  for(var counter = 0; counter <= minRows; counter++) {
    // Push quarter name (ex: 'Q1 2013') onto rowHeaders
    rowHeaders.push('Q' + (4 - q_counter) + ' ' + (moment().year() - Math.floor(counter / 4)));

    // Update q_counter to next quarter
    // If we've hit 3, go back down to 0 (only want 0, 1, 2, 3)
    q_counter = (q_counter < 3) ? q_counter + 1 : 0;
  }
  return rowHeaders;
}

function populate_data(companies, c_index, data) {
  var i = 0;
  var sections = ['operational', 'user_metrics', 'economics'];
  // (1) Iterate through each section
  for (var s in sections) {
    var section = sections[s];

    // (2) Iterate thru each category of data in each section of that company
    for(var c in companies[c_index][section]) {
      var category = companies[c_index][section][c];

      // (3) Iterate through each datum in that category
      for(var datum in category) {

        var entry = category[datum],
            row = 4 * (moment().year() - moment(entry.date).year()) +
                  (4 - moment(entry.date).quarter());

        data[row][i] = entry.value;

      } // (3) END each category of data in each section
      
      i++;

    } // (2) END each category of data in each section
  } // (1) END each section
  return data;
}

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

    console.log(this.elements.data);

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
    // console.log(data);

    $.post(
      '/portfolio/' + Data.values.permalink + '/editSpreadsheet',
      {
        col_headers: col_headers(companies),
        data: Data.data,
      },
      function(data) {
      }
    );

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
                    Object.keys(companies[1].economics).length,
      // Min # of quarters to display
          minRows = 4 * (moment().year() - 1990);

      // Initialize array to hold rows, represented by subarrays
      // Then, iterates thru each quarter to be represented
      // Fills Data.data with empty rows
      // Each row represents a quarter's data
      // Each row has minCols # of indices to fit each category
      Data.data = new Array([]);
      for(var counter = 0; counter < minRows; counter++) {
        Data.data.push(new Array());
      }

      for(var c_index in companies) {
        if(companies[c_index].username == company) {
          // Add the companies permalink into Data.values (for Data.save, later)
          Data.values.permalink = companies[c_index].permalink;

          // Populate Data.data with metrics
          Data.data = populate_data(companies, c_index, Data.data);
        }
      }

      $(Data.elements.data).handsontable({
        data: Data.data,
        height: window.innerHeight - (2 * 56),
        stretchH: 'all',
        minSpareRows: 0,
        minRows: minRows,
        minCols: minCols,
        colHeaders: col_headers(companies),
        rowHeaders: row_headers(minRows),
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        contextMenu: false,
        readOnly: false
      });
    }
  }
};
