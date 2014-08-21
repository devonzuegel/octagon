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

/* Function for generating the c3 graphs
 * params: takes the destination element, the data, and
 * a width multiplier */
function generateGraph(el, data, width_multiplier) {
  return c3.generate({
    bindto: el,
    color: { pattern: ['#38AEC3', '#459BD3'] },
    data: data,
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
    size: { height: 260, width: (window.innerWidth * 0.9 * width_multiplier) - 60 },
    padding: { right: 20, left: 40 },
    legend: { show: true },
    zoom: { enabled: true }
  });
}

var cashGraph = generateGraph(
  '#cashGraph',
  { 
    xs: { 'Cash': 'x1' },
    columns: [
      convertData(cash_data, 'date', 'x1'),
      convertData(cash_data, 'value', 'Cash'),
    ],
    type: 'area'
  },
  0.75
);

var grossBurnGraph = generateGraph(
  '#grossBurnGraph',
  { 
    xs: { 'Forecasted Gross burn': 'x1', 'Gross burn': 'x2' },
    columns: [
      convertData(pred_gross_burn_data, 'date', 'x1'),
      convertData(gross_burn_data, 'date', 'x2'),
      convertData(pred_gross_burn_data, 'value', 'Forecasted Gross burn'),
      convertData(gross_burn_data, 'value', 'Gross burn')
    ],
    type: 'bar'
  },
  0.5
);

var netBurnGraph = generateGraph(
  '#netBurnGraph',
  { 
    xs: { 'Forecasted Net burn': 'x1', 'Net burn': 'x2' },
    columns: [
      convertData(pred_net_burn_data, 'date', 'x1'),
      convertData(net_burn_data, 'date', 'x2'),
      convertData(pred_net_burn_data, 'value', 'Forecasted Net burn'),
      convertData(net_burn_data, 'value', 'Net burn')
    ],
    type: 'bar'
  },
  0.5
);

var revenueGraph = generateGraph(
  '#revenueGraph',
  { 
    xs: { 'Revenue': 'x1' },
    columns: [
      convertData(revenue_data, 'date', 'x1'),
      convertData(revenue_data, 'value', 'Revenue')
    ],
    type: 'bar'
  },
  0.75
);

var headCountGraph = generateGraph(
  '#headCountGraph',
  { 
    xs: { 'Head count': 'x1' },
    columns: [
      convertData(head_count_data, 'date', 'x1'),
      convertData(head_count_data, 'value', 'Head count')
    ],
    type: 'bar'
  },
  0.75
);

var avgDauGraph = generateGraph(
  '#avgDauGraph',
  { 
    xs: { 'AVG DAU': 'x1' },
    columns: [
      convertData(avg_dau_data, 'date', 'x1'),
      convertData(avg_dau_data, 'value', 'AVG DAU')
    ],
    type: 'bar'
  },
  0.75
);

var avgMauGraph = generateGraph(
  '#avgMauGraph',
  { 
    xs: { 'AVG MAU': 'x1' },
    columns: [
      convertData(avg_mau_data, 'date', 'x1'),
      convertData(avg_mau_data, 'value', 'AVG MAU')
    ],
    type: 'bar'
  },
  0.75
);

var churnGraph = generateGraph(
  '#churnGraph',
  { 
    xs: { 'Churn': 'x1' },
    columns: [
      convertData(churn_data, 'date', 'x1'),
      convertData(churn_data, 'value', 'Churn')
    ],
    type: 'bar'
  },
  0.75
);

var ltvGraph = generateGraph(
  '#ltvGraph',
  { 
    xs: { 'LTV': 'x1' },
    columns: [
      convertData(ltv_data, 'date', 'x1'),
      convertData(ltv_data, 'value', 'LTV')
    ],
    type: 'bar'
  },
  0.75
);

var lifetimeEstGraph = generateGraph(
  '#lifetimeEstGraph',
  { 
    xs: { 'Lifetime est.': 'x1' },
    columns: [
      convertData(lifetime_est_data, 'date', 'x1'),
      convertData(lifetime_est_data, 'value', 'Lifetime est.')
    ],
    type: 'bar'
  },
  0.75
);

var cacGraph = generateGraph(
  '#cacGraph',
  { 
    xs: { 'CAC': 'x1' },
    columns: [
      convertData(cac_data, 'date', 'x1'),
      convertData(cac_data, 'value', 'CAC')
    ],
    type: 'bar'
  },
  0.75
);

var aspGraph = generateGraph(
  '#aspGraph',
  { 
    xs: { 'ASP': 'x1' },
    columns: [
      convertData(asp_data, 'date', 'x1'),
      convertData(asp_data, 'value', 'ASP')
    ],
    type: 'bar'
  },
  0.75
);

var gmPercentageGraph = generateGraph(
  '#gmPercentageGraph',
  { 
    xs: { 'GM %': 'x1' },
    columns: [
      convertData(gm_percentage_data, 'date', 'x1'),
      convertData(gm_percentage_data, 'value', 'GM %')
    ],
    type: 'bar'
  },
  0.75
);