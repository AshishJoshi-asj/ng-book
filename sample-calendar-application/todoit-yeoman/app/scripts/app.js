'use strict';

angular.module('todoitApp', [
  'todoitApp.controllers',
  'todoitApp.services',
  'todoitApp.directives',
  'todoitApp.filters',
  'googleServices',
  'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeController'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        resolve: {
          user: function(googleApi, googleLoginApi) {
            googleApi.gapi().then(function(keys) {
              return googleLoginApi.getLoggedInStatus();
            });
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', 'googleLoginApi',
    function($rootScope, $location, googleLoginApi) {
      $rootScope.$on('user:login_required', function(evt) {
        $location.path('/');
      });
    }]);

angular.module('todoitApp.filters', []);
angular.module('todoitApp.controllers', []);
angular.module('todoitApp.directives', []);
angular.module('todoitApp.services', [])
  .value('version', '0.0.1');

function onLoadCallback() {
  var googleKeys = {
    clientId: '160814836764.apps.googleusercontent.com',
    apiKey: 'AIzaSyDY9DJGEpa4inRD0RB9xGOoFzd2rjWl--c',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  };
  window.bootGoogleApi(googleKeys);
}
