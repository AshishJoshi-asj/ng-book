angular.module('todoitApp.controllers')
.controller('DashboardController', 
    ['$scope', '$filter', '$parse', 'googleLoginApi', 'googleCalendarApi',
    function($scope, $filter, $parse, googleLoginApi, googleCalendarApi) {
      $scope.keepDate = 'all';
      $scope.events = [];
      $scope.filterNotifications = {
        all: 0,
        today: 0,
        tomorrow: 0,
        week: 0
      }

      $scope.$watch('entryInput', function(val) {
        $scope.newEntry = $filter('parseEntry')(val, $scope);
      });

      var refreshEvents = function() {
        googleCalendarApi.getEventsForCalendar('todoit')
        .then(function(d) {
          $scope.events = d;
        });
      }

      refreshEvents();

      $scope.sort = function(by) {
        if (by === 'all') $scope.keepDate = 'all';
        else if (by === 'next week') {
          var date = new Date();
          $scope.keepDate = new Date(date.setDate(date.getDate() + 7));
        }
        else $scope.keepDate = chrono.parseDate(by);
      }

      $scope.excludeByDate = function(input) {
        if ($scope.keepDate === 'all') {
          return true;
        } else {
          return new Date(input.start.dateTime).getTime() < 
                      $scope.keepDate.getTime();
        }
      }

      var date = new Date();
      var nextWeek = new Date(date.setDate(date.getDate() + 7));
      var tomorrow = chrono.parseDate('tomorrow at 11:59pm');
      var today = chrono.parseDate('today at 11:59pm');
      
      $scope.$watch('events', function(val) {
        if (val && val.length > 0) {
          $scope.filterNotifications = {
            all: 0,
            today: 0,
            tomorrow: 0,
            week: 0
          }

          angular.forEach(val, function(value, key){
            date = new Date(value.start.dateTime);
            $scope.filterNotifications.all += 1;
            if (date < nextWeek) {
              $scope.filterNotifications.week += 1;
              if (date < tomorrow) {
                $scope.filterNotifications.tomorrow += 1;
                if (date < today) {
                  $scope.filterNotifications.today += 1;
                }
              }
            }
          });
        }
      });

      $scope.insertEvent = function() {
        if (typeof($scope.newEntry.date) !== 'undefined') {
          googleCalendarApi.addEventToCalendar($scope.newEntry, 'todoit')
          .then(function(d) {
            if (typeof(d.error) === 'undefined') {
              $scope.events.push(d);
              refreshEvents();
              $scope.entryInput = "";
            } else {
              console.error("error", d);
            }
          });
        }
      }

      $scope.deleteEvent = function(evt) {
        var evtId = evt.id;
        googleCalendarApi.deleteEventFromCalendar(evtId, 'todoit')
        .then(function(d) {
          var idx = $scope.events.indexOf(evt);
          $scope.events.splice(idx, 1);
          refreshEvents();
        });
      }
  }]);