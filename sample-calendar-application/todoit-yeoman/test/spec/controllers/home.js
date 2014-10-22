'use strict';

describe('Controller: HomeController', function () {

  // load the controller's module
  beforeEach(module('todoitApp'));

  var HomeController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomeController = $controller('HomeController', {
      $scope: scope
    });
  }));

});
