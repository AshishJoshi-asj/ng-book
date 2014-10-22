'use strict';

describe('Unit controllers: ', function(){

  beforeEach(module('myApp'));

  describe('FrameController', function() {

    // Local variables
    var FrameController, scope, timeout;
    beforeEach(inject(
      function($controller, $rootScope) {
        scope = $rootScope.$new();
        timeout = jasmine.createSpy('timeout');
        FrameController = $controller('FrameController', {
          $scope: scope,
          $timeout: timeout
        });
    }));

    // Testing the FrameController values
    it('should have today set', function() {
      expect(scope.time.today).toBeDefined();
    });

    it('should have a user set', function() {
      expect(scope.user).toBeDefined();
    });

    it('should have the timezone for the user', function() {
      expect(scope.user.timezone).toBeDefined();
    });

    it('should set the clock a foot', function() {
      expect(timeout).toHaveBeenCalled();
    });

  });
});
