angular.module('app.filters', []).filter('uppercase', [function() {
  return function(input) {
    if (angular.isString(input)) {
      return input.toUpperCase();
    } else {
      return input;
    }
  }  
}]);