'use strict';

angular.module('myApp.directives', [])
.directive('ensureHasDate', [function() {
  return {
    require: '^ngModel',
    scope: {
      'ngModel': '=',
      'ensureHasDate': '='
    },
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function(newVal) {
        console.log('newVal', scope.ensureHasDate);
        c.$setValidity('hasDate', true);
      });
    }
  }
}])
.directive('ngCalendar', [function() {
  // Array to store month names
  var months = new Array('January',' February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'); 

  // Array to store month days
  var monthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

  // Array to store week names
  var weekDay = new Array('Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa');
  return {
    require: '^ngModel',
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'views/calendar.html',
    link: function(scope, ele, attrs, c) {
        scope.$watch('ngModel', function(date) {
          if (!date) date = new Date();
          var week_day, day_counter, i, curr_week;
          
          var day = date.getDate(),
              month = date.getMonth(),
              year = date.getFullYear();
          scope.days_in_this_month = monthDays[month];
          scope.monthName = months[month];

          scope.currentWeek = 0;

          scope.month = {};

          var thisMonth = new Date(year, month, 1),
              firstDay = new Date(thisMonth.setDate(1)).getDay(),
              weeksOfMonth = Math.ceil((firstDay + scope.days_in_this_month)/ 7) + 1;

          scope.weekDays = weekDay;
          // First week
          curr_week = 0;

          scope.month[curr_week] = [];
          for (week_day = 0; week_day < thisMonth.getDay(); week_day++) {
            scope.month[curr_week][week_day] = week_day * -1;
          }
          week_day = thisMonth.getDay();
          for (day_counter = 1; day_counter <= scope.days_in_this_month; day_counter++) {
            week_day %= 7;

            if (week_day == 0) {
              curr_week += 1;
              scope.month[curr_week] = [];
            }

            scope.month[curr_week].push(day_counter);

            week_day += 1;
          }

          while(scope.month[curr_week].length < 7) {
            scope.month[curr_week].push(day_counter * -1);
          }

          scope.day = day;
          scope.year = year;
        });
    }
  }
}]);

