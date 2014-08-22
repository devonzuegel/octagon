$(document).ready(function () {

  if(typeof companies !== 'undefined') {

    var data = new Array([]),
        colHeaders = new Array(),
        rowHeaders = new Array();

    var minRows = 4 * (moment().year() - 2010),
        minCols = Object.keys(companies[1].operational).length +
                  Object.keys(companies[1].user_metrics).length +
                  Object.keys(companies[1].economics).length;

    var q_counter = 0;
    for(var counter = 0; counter < minRows; counter++) {
      data.push(new Array(minCols));
      rowHeaders.push('Q' + (4 - q_counter) + ' ' + (moment().year() - Math.floor(counter / 4)));

      if(q_counter < 3) {
        q_counter++;
      } else {
        q_counter = 0;
      }
    }

    var i = 0;
    for(var c in companies) {
      if(companies[c].username == 'Esper') {

        var p;
        for(p in companies[c].operational) {

          colHeaders.push(p);

          for(var o in companies[c].operational[p]) {

            var entry = companies[c].operational[p][o],
                row = 4 * (moment().year() - moment(entry.date).year()) + (4 - moment(entry.date).quarter());

            console.log(moment().year() - moment(entry.date).year());

            data[row][i] = entry.value;
          }
          i++;
        }

        for(p in companies[c].user_metrics) {

          colHeaders.push(p);

          for(var o in companies[c].user_metrics[p]) {

            var entry = companies[c].user_metrics[p][o],
                row = 4 * (moment().year() - moment(entry.date).year()) + (4 - moment(entry.date).quarter());

            console.log(moment().year() - moment(entry.date).year());

            data[row][i] = entry.value;
          }
          i++;
        }

        for(p in companies[c].economics) {

          colHeaders.push(p);

          for(var o in companies[c].economics[p]) {

            var entry = companies[c].economics[p][o],
                row = 4 * (moment().year() - moment(entry.date).year()) + (4 - moment(entry.date).quarter());

            console.log(moment().year() - moment(entry.date).year());

            data[row][i] = entry.value;
          }
          i++;
        }
      }
    }
    
    $('#data').handsontable({
      data: data,
      stretchH: 'all',
      minSpareRows: 1,
      minRows: minRows,
      minCols: minCols,
      colHeaders: colHeaders,
      rowHeaders: rowHeaders,
      currentRowClassName: 'currentRow',
      currentColClassName: 'currentCol',
      contextMenu: false
    });
  }
});