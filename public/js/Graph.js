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
      new_data.push(moment(data[i][field]).format('YYYY-MM-DD'));
    } else {

      // Push the data into the array
      new_data.push(data[i][field]);
    }
  }

  // Return the new array
  return new_data;
}

var burnGraph = c3.generate({
  bindto: '#burnGraph',
  color: { 
    pattern: ['#9b74e3', '#8a64d1', '#45367c'] 
  },
  data: {
    xs: {
      'data1': 'x1',
      'data2': 'x2'
    },
    columns: [
      convertData(gross_burn_data, 'timestamp', 'x1'),
      convertData(net_burn_data, 'timestamp', 'x2'),
      convertData(gross_burn_data, 'value', 'data1'),
      convertData(net_burn_data, 'value', 'data2')
    ],
    type: 'bar'
  },
  bar: {
    width: {
      ratio: 0.5
    }
  },
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y-%m-%d'
      }
    }
  },
  size: {
    height: 260,
    width: (window.innerWidth * 0.9 * 0.5) - 60
  },
  padding: {
    right: 10,
    left: 10
  },
  legend: {
    show: false
  }
});

var revenueGraph = c3.generate({
  bindto: '#revenueGraph',
  color: { 
    pattern: ['#9b74e3', '#8a64d1', '#45367c'] 
  },
  data: {
    xs: {
      'data1': 'x1'
    },
    columns: [
      convertData(revenue_data, 'timestamp', 'x1'),
      convertData(revenue_data, 'value', 'data1')
    ],
    type: 'bar'
  },
  bar: {
    width: {
      ratio: 0.5
    }
  },
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y-%m-%d'
      }
    }
  },
  size: {
    height: 260,
    width: (window.innerWidth * 0.9 * 0.75) - 60
  },
  padding: {
    right: 10,
    left: 10
  },
  legend: {
    show: false
  }
});

var headCountGraph = c3.generate({
  bindto: '#headCountGraph',
  color: { 
    pattern: ['#9b74e3', '#8a64d1', '#45367c'] 
  },
  data: {
    xs: {
      'data1': 'x1'
    },
    columns: [
      convertData(head_count_data, 'timestamp', 'x1'),
      convertData(head_count_data, 'value', 'data1')
    ],
    type: 'bar'
  },
  bar: {
    width: {
      ratio: 0.5
    }
  },
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y-%m-%d'
      }
    }
  },
  size: {
    height: 260,
    width: (window.innerWidth * 0.9 * 0.75) - 60
  },
  padding: {
    right: 10,
    left: 10
  },
  legend: {
    show: false
  }
});