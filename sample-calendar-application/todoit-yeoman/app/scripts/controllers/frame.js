angular.module('todoitApp.controllers')
  .controller('FrameController', 
    ['$scope', '$location', '$timeout', 'googleLoginApi',
    function($scope, $location, $timeout, googleLoginApi) {

      $scope.today = new Date();
      $scope.timezone = 'US/Pacific';

      $scope.getLoggedInStatus = function() {
        return googleLoginApi.getLoggedInStatus();
      }

      $scope.login = function() {
        googleLoginApi.login()
        .then(function(d) {
          $scope.name = d.name;
          $location.url('/dashboard');
        });
      }

        var updateClock = function() {
          $scope.today = new Date();
        };
        var timer = setInterval(function() {
          $scope.$apply(updateClock);
        }, 1000);
        updateClock();
  }])