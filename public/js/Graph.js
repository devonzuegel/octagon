var burnGraph = c3.generate({
  bindto: '#burnGraph',
  data: {
    columns: [
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 50, 20, 10, 40, 15, 25]
    ]
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
  data: {
    columns: [
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 130, 100, 140, 200, 150, 50]
    ],
    type: 'bar'
  },
  bar: {
    width: {
      ratio: 0.5 // this makes bar width 50% of length between ticks
    }
    // or
    //width: 100 // this makes bar width 100px
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