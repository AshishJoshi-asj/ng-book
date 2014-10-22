// var app = module("myApp");

var boot = function() {
  angular.element(document).ready(function() {
    window.gapi = {
      client: {
        setApiKey: function() {}
      },
      auth: {
        authorize: function() {}
      }
    };
    angular.bootstrap(document, ['myApp']);
  });
}

window.bootE2E = function() {
  angular.module('myApp')
    .run(['$httpBackend', function($httpBackend) {
      console.log("-->");
    // $httpBackend.whenGET(/content\.googleapis\.com\/discovery\/v1\/apis\/oauth2\/v2\/rpc/)
    //   .respond({"methods":{"oauth2.tokeninfo":{"id":"oauth2.tokeninfo"},"oauth2.userinfo.get":{"id":"oauth2.userinfo.get"},"oauth2.userinfo.v2.me.get":{"id":"oauth2.userinfo.v2.me.get"}}});
    $httpBackend.whenGET(/^views\//).passThrough();
  }]);
}
