'use strict';
define([], function() {
  var dependencies = ['$scope', '$modal', 'AnalysesResource'];
  var ModelController = function($scope, $modal, AnalysesResource) {
    $scope.analysesLoaded = false;

    function loadAnalyses() {
      $scope.analyses = AnalysesResource.query(function(result) {
        $scope.analysesLoaded = true;
      });
    }
    loadAnalyses();

    $scope.createAnalysisDialog = function() {
      $modal.open({
        templateUrl: './js/analyses/addAnalysis.html',
        scope: $scope,
        controller: 'AddAnalysisController'
      });
    };

    $scope.isAddButtonDisabled = function(analysis) {
      return !analysis ||
        !analysis.title ||
        !analysis.outcome ||
        !analysis.problem ||
        !!$scope.isAddingAnalysis;
    }
  }
  return dependencies.concat(ModelController);
});