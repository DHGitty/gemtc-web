'use strict';
define(
  ['angular',
    'require',
    'jQuery',
    'lodash',
    'mmfoundation',
    'foundation',
    'angular-ui-router',
    'angularanimate',
    'ngSanitize',
    'controllers',
    'constants',
    'services',
    'analyses/analyses',
    'models/models',
    'util/util',
    'patavi/patavi',
    'angular-patavi-client',
    'help-popup',
    'error-reporting'
  ],
  function(angular, require, $, _) {

    var dependencies = [
      'ui.router',
      'ngSanitize',
      'mm.foundation.tpls',
      'mm.foundation.modal',
      'gemtc.controllers',
      'gemtc.constants',
      'gemtc.services',
      'gemtc.analyses',
      'gemtc.models',
      'gemtc.util',
      'gemtc.patavi',
      'patavi',
      'help-directive',
      'errorReporting'
    ];

    var app = angular.module('gemtc', dependencies);

    app.run(['$rootScope', '$window', '$http', '$location', '$anchorScroll', 'HelpPopupService',
      function($rootScope, $window, $http, $location, $anchorScroll, HelpPopupService) {

        $rootScope.$on('$viewContentLoaded', function() {
          $(document).foundation();
        });

        $rootScope.$safeApply = function($scope, fn) {
          var phase = $scope.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            this.$eval(fn);
          } else {
            this.$apply(fn);
          }
        };

        HelpPopupService.loadLexicon($http.get('lexicon.json'));
      }
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide',
      function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {

        $provide.decorator('$uiViewScroll', function($delegate) {
          return function(uiViewElement) {
            window.scrollTo(0, (uiViewElement[0].getBoundingClientRect().top - 200));
          };
        });

        $httpProvider.interceptors.push('sessionExpiredInterceptor');

        $stateProvider
          .state('analyses', {
            url: '/analyses',
            templateUrl: '/js/analyses/analyses.html',
            controller: 'AnalysesController'
          })
          .state('analysis-container', {
            abstract: true,
            templateUrl: '/js/analyses/abstract-analysis.html',
          })
          .state('networkMetaAnalysis', {
            parent: 'analysis-container',
            url: '/analyses/:analysisId',
            views: {
              'analysis': {
                templateUrl: '/js/analyses/analysis.html',
                controller: 'AnalysisController'
              },
              'models': {
                templateUrl: '/js/models/models.html',
                controller: 'ModelsController'
              },
              'networkGraph': {
                templateUrl: '/js/analyses/networkGraph.html',
                controller: 'NetworkGraphController'
              },
              'evidenceTable': {
                templateUrl: '/js/analyses/evidenceTable.html',
                controller: 'EvidenceTableController'
              },
              'relativeEffectTable': {
                templateUrl: '/js/analyses/relativeEffectTable.html',
                controller: 'RelativeEffectTableController'
              }
            }
          })
          .state('createModel', {
            url: '/analyses/:analysisId/models/createModel',
            templateUrl: 'js/models/createModel.html',
            controller: 'CreateModelController'
          })
          .state('standalone-model-container', {
            templateUrl: 'js/models/standalone-model-container.html'
          })
          .state('model', {
            parent: 'standalone-model-container',
            url: '/analyses/:analysisId/models/:modelId',
            templateUrl: 'views/modelView.html',
            controller: 'ModelController'
          })
          .state('nodeSplitOverview', {
            parent: 'model',
            url: '/nodeSplitOverview',
            templateUrl: 'js/models/nodeSplitOverview.html',
            controller: 'NodeSplitOverviewController',
            resolve: {
              models: ['$stateParams', 'ModelResource',
                function($stateParams, ModelResource) {
                  return ModelResource.query({
                    analysisId: $stateParams.analysisId
                  }).$promise;
                }
              ],
              problem: ['$stateParams', 'ProblemResource',
                function($stateParams, ProblemResource) {
                  return ProblemResource.get({
                    analysisId: $stateParams.analysisId
                  }).$promise;
                }
              ]

            }
          })
          .state('error', {
            url: '/error',
            // need to use template instead of url because we can't get new files from crashed server
            template: '  <section> ' +
              ' <div class="row"> ' +
              ' <div class="columns large-offset-2 large-8 medium-12"> ' +
              ' <h1>Error</h1> ' +
              ' </h1> ' +
              ' </div> ' +
              ' </div> ' +
              ' </section> ' +

            ' <section class="content"> ' +
              ' <div class="row"> ' +
              '  <div class="columns large-offset-2 large-8 medium-12"> ' +
              '     Sorry! An unknown error has occurred. Please sign in again. ' +
              ' If the problem persists please contact the developers via <a href="https://www.drugis.org/contact">our contact page</a> ' +
              '     <form id="SignInForm" action="auth/google" method="GET"> ' +
              '   <input type="hidden" name="scope" value="profile email" /> ' +
              '   <div> ' +
              '   <button class=" button" type="submit" tabindex="1" >Sign In with Google</button> ' +
              ' </div> ' +
              ' </form> ' +
              '     </div> ' +
              ' </div> ' +
              ' </section> '
          });

        // Default route
        $urlRouterProvider.otherwise('/analyses');
      }
    ]);

    return app;
  });
