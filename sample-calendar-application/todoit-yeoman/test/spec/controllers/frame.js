'use strict';

describe('Controller: FrameController', function () {

  // load the controller's module
  beforeEach(module('todoitApp'));

  var FrameController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FrameController = $controller('FrameController', {
      $scope: scope
    });
  }));

  // it('has todays date', function() {
  //   console.log(FrameController);
  //   expect(scope.today).toBeDefined();
  // });

});
