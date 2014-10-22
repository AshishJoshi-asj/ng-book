angular.module('todoitApp.directives')
.directive('ensureHasDate', [function() {
  return {
    require: '^ngModel',
    scope: {
      'ngModel': '=',
      'ensureHasDate': '='
    },
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function(newVal) {
        console.log('newVal', scope.ensureHasDate);
        c.$setValidity('hasDate', true);
      });
    }
  }
}])