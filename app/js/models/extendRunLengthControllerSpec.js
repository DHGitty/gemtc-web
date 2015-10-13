define(['angular', 'angular-mocks', 'analyses/analyses', 'models/models'], function() {
  describe('the extend runlength controller', function() {
    var scope,
      q,
      stateParamsMock,
      modelResourceMock,
      modalInstanceMock,
      modelMock = {
        burnInIterations: 100,
        inferenceIterations: 200,
        thinningFactor: 10
      },
      successCallbackMock;


    beforeEach(module('gemtc.models'));

    beforeEach(inject(function($rootScope, $controller, $q) {
      scope = $rootScope;
      $controller('ExtendRunLengthController', {
        $scope: scope,
        $modalInstance: modalInstanceMock,
        $stateParams: stateParamsMock,
        model: modelMock,
        successCallback: successCallbackMock
      });
    }));

    describe('when first initialised', function() {
      beforeEach(function() {
        modelMock = {
          burnInIterations: 100,
          inferenceIterations: 200,
          thinningFactor: 10
        };
      });
      it('should place runlength settings on the scope', function() {
        expect(scope.runLengthSettings.burnInIterations).toBe(modelMock.burnInIterations);
      });
      describe('isExtendButtonDisabled function on the scope', function() {
        it('should be on the scope', function() {
          expect(scope.isExtendButtonDisabled).toBeDefined();
        });
        it('should return true for burnInIterations not divisible by the thinningFactor', function() {
          var runLengthSettings = {
            burnInIterations: 17,
            inferenceIterations: 100,
            thinningFactor: 10
          };
          expect(scope.isExtendButtonDisabled(runLengthSettings)).toBe(true);
        });
        it('should return true for inferenceIterations not divisible by the thinningFactor', function() {
          var runLengthSettings = {
            burnInIterations: 20,
            inferenceIterations: 107,
            thinningFactor: 10
          };
          expect(scope.isExtendButtonDisabled(runLengthSettings)).toBe(true);
        });
        it('should return false for correct runLengthSettings', function() {
          var runLengthSettings = {
            burnInIterations: 30,
            inferenceIterations: 100,
            thinningFactor: 10
          };
          expect(scope.isExtendButtonDisabled(runLengthSettings)).toBe(false);
        });
      });
    });

  });
});