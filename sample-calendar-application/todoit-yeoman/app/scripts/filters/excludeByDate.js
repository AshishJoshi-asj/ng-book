angular.module('todoitApp.filters')
  .filter('excludeByDate', function() {
    return function(input, date) {
      // console.log("input", input, date);
      if (date === 'all') {
        return input;
      } else {
        var i = 0, evtDate, keepDates = [];
        // For each date object
        evtDate = new Date(input[i].start.dateTime);
        console.log(input[i].summary, evtDate, date, evtDate < date);
        if (evtDate <= date) {
          return input;
        }
      }
    }
  })