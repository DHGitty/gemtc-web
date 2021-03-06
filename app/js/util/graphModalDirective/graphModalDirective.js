'use strict';
define([], function() {
  var dependencies = ['$modal'];
  var GraphModalDirective = function($modal) {
    return {
      scope: {
        diagnosticsMap: '=',
        selectedComparison: '='
      },
      restrict: 'E',
      // using template because loading teplateUrl irritating in submodule
      templateUrl: './graphModalDirective.html',
      link: function(scope) {

        scope.openModal = function() {
          $modal.open({
            templateUrl: './plotNavigation.html',
            scope: scope,
            windowClass: 'small',
            controller: 'PlotNavigationController'
          });
        };
      }
    };
  };
  return dependencies.concat(GraphModalDirective);
});
