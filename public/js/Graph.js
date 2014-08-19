/* Function for converting data stored in objects
 * to a format that c3js loves */
function convertData(data, field, label) {

  // Create a new array with its label
  var new_data = [label];

  // Loop through the data object
  for(var i = 0; i < data.length; i++) {

    // If it is a timestamp field
    if(field === 'timestamp') {

      // Convert it to a nice format before pushing into the array
      new_data.push('Q' + moment(data[i][field]).quarter() + ' ' + moment().year());
    } else {

      // Push the data into the array
      new_data.push(data[i][field]);
    }
  }

  // Return the new array
  return new_data;
}


// Graphs
var burnGraph = c3.generate({
  bindto: '#burnGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: {
    xs: {
      'Gross burn': 'x1',
      'Net burn': 'x2'
    },
    columns: [
      convertData(gross_burn_data, 'timestamp', 'x1'),
      convertData(net_burn_data, 'timestamp', 'x2'),
      convertData(gross_burn_data, 'value', 'Gross burn'),
      convertData(net_burn_data, 'value', 'Net burn')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { x: { type: 'category' } },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.5) - 60 },
  padding: { right: 10, left: 10 },
  legend: { show: false }
});

var revenueGraph = c3.generate({
  bindto: '#revenueGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: {
    xs: {
      'Revenue': 'x1'
    },
    columns: [
      convertData(revenue_data, 'timestamp', 'x1'),
      convertData(revenue_data, 'value', 'Revenue')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { x: { type: 'category' } },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 10, left: 10 },
  legend: { show: false }
});

var headCountGraph = c3.generate({
  bindto: '#headCountGraph',
  color: { pattern: ['#38AEC3', '#459BD3'] },
  data: {
    xs: {
      'Head count': 'x1'
    },
    columns: [
      convertData(head_count_data, 'timestamp', 'x1'),
      convertData(head_count_data, 'value', 'Head count')
    ],
    type: 'bar'
  },
  bar: { width: { ratio: 0.5 } },
  axis: { x: { type: 'category' } },
  size: { height: 260, width: (window.innerWidth * 0.9 * 0.75) - 60 },
  padding: { right: 10, left: 10 },
  legend: { show: false }
});