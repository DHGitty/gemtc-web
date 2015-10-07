'use strict';
define(['angular', 'angular-resource'], function(angular, angularResource) {
  var dependencies = ['$resource'];
  var ModelResource = function($resource) {
    return $resource('/projects/:projectId/analyses/:analysisId/models/:modelId', {
      projectId: '@projectId',
      analysisId: '@analysisId',
      modelId: '@id'
    }, {
      extendRunLength: {
        method: 'post',
        params: {
          projectId: '@projectId',
          analysisId: '@analysisId',
          modelId: '@id'
        },
        url: '/projects/:projectId/analyses/:analysisId/models/:modelId'
      }
    });
  };
  return dependencies.concat(ModelResource);
});
