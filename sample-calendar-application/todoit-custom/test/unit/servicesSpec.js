describe('Unit: services', function() {

  beforeEach(module('myApp'));

  describe('version', function() {
    var version;
    beforeEach(inject(function($injector) {
      version = $injector.get('version');
    }));

    it('should have the version as a service', function() {
      expect(version).toEqual('0.0.1');
    });
  });

  describe('googleServices', function() {
    var googleApi, q,
        resolvedValue;

    beforeEach(inject(function($injector) {
      googleApi = $injector.get('googleApi');
      q = $injector.get('$q');
      spyOn(googleApi, 'gapi')
        .andCallFake(function() {
          var d = q.defer();
          setTimeout(function() {
            resolvedValue = {
              clientId: '12345'
            };
          }, 100);
          return d.promise;
        });
      googleApi.gapi().then(function(resp) {
        resolvedValue = resp;
      });
    }));

    describe('googleApi', function() {

      beforeEach(function() {
        waitsFor(function() {
          return resolvedValue !== undefined;
        }, 500);
      });

      it('should have a gapi function', function() {
        expect(
          typeof(googleApi.gapi)
        ).toEqual('function');
      });

      it('should call gapi', function() {
        expect(googleApi.gapi.callCount)
          .toEqual(1);
      });

      it('should resolve with the browser keys', function() {
        expect(resolvedValue.clientId)
          .toBeDefined();
      });
    });

    describe('googleAuthApi', function() {
      var authorizedValue, gapiAuth;
      var gapi = {
        auth: {
          authorize: function() {}
        }
      };
      module(function($provide) {
        $provide.value('$window', gapi);
      });

      beforeEach(inject(function($injector) {
        googleAuthApi = $injector.get('googleAuthApi');
        gapiAuth = spyOn(gapi.auth, 'authorize')
          .andCallThrough();
      }));

      it('should have an authorize method', function() {
        expect(
          typeof(googleAuthApi.authorize)
        ).toEqual('function');
      });
    });
  });
});