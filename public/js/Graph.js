/* Function for converting data stored in objects
 * to a format that c3js loves */
function convertData(data, field, label) {

  // Create a new array with its label
  var new_data = [label];

  // Loop through the data object
  for(var i = 0; i < data.length; i++) {

      // Push the data into the array
      new_data.push(data[i][field]);
  }

  // Return the new array
  return new_data;
}

// Operational Graphs
var burnGraph = c3.generate({
  bindto: '#burnGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { 
    xs: { 'Gross burn': 'x1', 'Net burn': 'x2' },
    columns: [
      convertData(gross_burn_data, 'quarter', 'x1'),
      convertData(net_burn_data, 'quarter', 'x2'),
      convertData(gross_burn_data, 'value', 'Gross burn'),
      convertData(net_burn_data, 'value', 'Net burn')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.5) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var revenueGraph = c3.generate({
  bindto: '#revenueGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'Revenue': 'x1' },
    columns: [
      convertData(revenue_data, 'timestamp', 'x1'),
      convertData(revenue_data, 'value', 'Revenue')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var headCountGraph = c3.generate({
  bindto: '#headCountGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'Head count': 'x1' },
    columns: [
      convertData(head_count_data, 'timestamp', 'x1'),
      convertData(head_count_data, 'value', 'Head count')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

// User Metrics Graphs
var avgDauGraph = c3.generate({
  bindto: '#avgDauGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'AVG DAU': 'x1' },
    columns: [
      convertData(avg_dau_data, 'timestamp', 'x1'),
      convertData(avg_dau_data, 'value', 'AVG DAU')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var avgMauGraph = c3.generate({
  bindto: '#avgMauGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'AVG MAU': 'x1' },
    columns: [
      convertData(avg_mau_data, 'timestamp', 'x1'),
      convertData(avg_mau_data, 'value', 'AVG MAU')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var churnGraph = c3.generate({
  bindto: '#churnGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'Churn': 'x1' },
    columns: [
      convertData(churn_data, 'timestamp', 'x1'),
      convertData(churn_data, 'value', 'Churn')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

// Economics Graphs
var ltvGraph = c3.generate({
  bindto: '#ltvGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'LTV': 'x1' },
    columns: [
      convertData(ltv_data, 'timestamp', 'x1'),
      convertData(ltv_data, 'value', 'LTV')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var lifetimeEstGraph = c3.generate({
  bindto: '#lifetimeEstGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'Lifetime est.': 'x1' },
    columns: [
      convertData(lifetime_est_data, 'timestamp', 'x1'),
      convertData(lifetime_est_data, 'value', 'Lifetime est.')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var cacGraph = c3.generate({
  bindto: '#cacGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'CAC': 'x1' },
    columns: [
      convertData(cac_data, 'timestamp', 'x1'),
      convertData(cac_data, 'value', 'CAC')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var aspGraph = c3.generate({
  bindto: '#aspGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'ASP': 'x1' },
    columns: [
      convertData(asp_data, 'timestamp', 'x1'),
      convertData(asp_data, 'value', 'ASP')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});

var gmPercentageGraph = c3.generate({
  bindto: '#gmPercentageGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: { xs: { 'GM %': 'x1' },
    columns: [
      convertData(gm_percentage_data, 'timestamp', 'x1'),
      convertData(gm_percentage_data, 'value', 'GM %')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { 
    x: { 
      type: 'timeseries',
      tick: {
        format: function (x) { 
          return 'Q' + moment(x).quarter() + ' ' + moment(x).year(); 
        }
      }
    }
  },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 20, left: 40 },
  legend: { show: true }
});