'use strict';

describe('Routes test', function() {
  // Mock our module in our tests
  beforeEach(module('myApp'));

  var $location, $route, $rootScope;
  beforeEach(inject(
    function(_$location_, _$route_, _$rootScope_) {
      $location = _$location_;
      $route = _$route_;
      $rootScope = _$rootScope_;
    }));

  // Our tests will code here
  describe('index', function() {
    beforeEach(inject(function($httpBackend) {
      $httpBackend
        .expectGET('views/home.html')
        .respond(200, 'mainHTML');
    }));

    it('should load on successful request to "/"',
      function() {
        $location.path('/');
        $rootScope.$digest();

        expect($route.current.controller)
          .toBe('HomeController');
    });

    it('should load on route that does not exist', 
      function() {
        $location.path('/non/existant/route/never');
        $rootScope.$digest();

        expect($route.current.controller)
          .toBe('HomeController');
    });
  });

  describe('dashboard', function() {
    var $httpBackend;
    beforeEach(inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend
        .expectGET('views/dashboard.html')
        .respond(200, 'dashboard');
    }));

    it('should load the dashboard', 
      function() {
        $location.path('/dashboard');
        $rootScope.$digest();

        expect($route.current.controller)
          .toBe('DashboardController');
    });

    it('should have a resolve user',
      function() {
        $location.path('/dashboard');
        $rootScope.$digest();

        expect($route.current.resolve.user)
          .toBeDefined();
      });

  });
});