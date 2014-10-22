'use strict';

angular.module('myApp.controllers', [])
  .controller('FrameController', 
    ['$scope', '$location', '$timeout', 'googleLoginApi',
    function($scope, $location, $timeout, googleLoginApi) {

      $scope.time = {
        today: new Date()
      };

      $scope.user = {
        timezone: 'US/Pacific'
      }

      $scope.getLoggedInStatus = function() {
        return googleLoginApi.getLoggedInStatus();
      }

      $scope.$on('user:authorized', function(evt, auth) {
        googleLoginApi.login().then(function(d) {
          $scope.user.details = d;
        });
      });

      $scope.updateClock = function() {
        $scope.time.today = new Date();
      };
      var tick = function() {
        $timeout(function() {
          $scope.$apply($scope.updateClock);
          tick();
        }, 1000);
      }
      // tick();
  }])
  .controller('HomeController', 
    ['$scope', '$location', 'googleAuthApi', 'googleCalendarApi',
      function($scope, $location, googleAuthApi, googleCalendarApi) {
  }])
  .controller('LoginController', 
    ['$scope', '$location', 'googleLoginApi',
      function($scope, $location, googleLoginApi) {
        $scope.loggingInUser = {};
        $scope.login = function() {
          if ($scope.loggingInUser.email == "ari@fullstack.io" &&
              $scope.loggingInUser.password == "123123") {
            $location.url('/dashboard');
          } else {
            $scope.loggingInUser.errors = {
              email: "Invalid email & password combination"
            }
          }
        }
        $scope.auth_with_google = function() {
          googleLoginApi.login()
            .then(function(d) {
              $scope.user.name = d.name;
              $location.url('/dashboard');
            });
        }
  }])
  .controller('DashboardController', 
    ['$scope', '$filter', '$parse', 'googleLoginApi', 'googleCalendarApi',
    function($scope, $filter, $parse, googleLoginApi, googleCalendarApi) {
      $scope.keepDate = 'all';
      var date = new Date();
      $scope.dateFilters = {
        'all': 'all',
        'next week': new Date(date.setDate(date.getDate() + 7)),
        'tomorrow': chrono.parseDate('tomorrow at 11:59pm'),
        'today': chrono.parseDate('today at 11:59pm')
      }
      $scope.events = [];
      $scope.filterNotifications = {
        all: 0,
        today: 0,
        tomorrow: 0,
        week: 0
      }

      $scope.$watch('entryInput', function(val) {
        $scope.newEntry = 
          $filter('parseEntry')(val, $scope.users || {});
      });

      var refreshEvents = function() {
        googleCalendarApi.getEventsForCalendar('todoit')
        .then(function(d) {
          $scope.events = d;
        });
      }

      refreshEvents();

      $scope.excludeByDate = function(input) {
        if ($scope.keepDate === 'all') {
          return true;
        } else {
          return new Date(input.start.dateTime).getTime() < 
                      $scope.keepDate.getTime();
        }
      }

      $scope.$watch('events', function(val) {
        if (val && val.length > 0) {
          var date = new Date();
          var nextWeek = new Date(date.setDate(date.getDate() + 7));
          var tomorrow = chrono.parseDate('tomorrow at 11:59pm');
          var today = chrono.parseDate('today at 11:59pm');

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