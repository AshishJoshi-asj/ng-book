'use strict';

// App
function onLoadCallback() {
  var googleKeys = {
    clientId: 'YOUR_CLIENT_ID',
    apiKey: 'YOUR_API_KEY',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  };
  window.bootGoogleApi(googleKeys);
}

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngRoute',
  'googleServices'
])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', 
        {
          templateUrl: 'views/home.html', 
          controller: 'HomeController'
        })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        resolve: {
          user: function(googleApi, googleLoginApi) {
            googleApi.then(function(keys) {
              return googleLoginApi.getLoggedInStatus();
            });
          }
        }
      })
      .otherwise({redirectTo: '/'});

}])
.run(['$rootScope', '$location', 'googleLoginApi',
  function($rootScope, $location, googleLoginApi) {
    $rootScope.$on('user:authorized', function(evt) {
      $location.path('/dashboard');
    });
    $rootScope.$on('user:login_required', function(evt) {
      $location.path('/');
    });
  }]);