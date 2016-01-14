'use strict';
define(['angular', 'angular-mocks', 'analyses/analyses'], function() {
  describe('The analysis service', function() {

    var analysisService;

    beforeEach(module('gemtc.analyses'));

    beforeEach(inject(function(AnalysisService) {
      analysisService = AnalysisService;
    }));

    describe('problemToStudyMap', function() {

      var problem = {
        "entries": [{
          "study": "Study1",
          "treatment": 1,
          "responders": 58,
          "sampleSize": 100
        }, {
          "study": "Study1",
          "treatment": 2,
          "responders": 53,
          "sampleSize": 103
        }, {
          "study": "Study2",
          "treatment": 1,
          "responders": 58,
          "sampleSize": 100
        }, {
          "study": "Study2",
          "treatment": 2,
          "responders": 53,
          "sampleSize": 103
        }],
        "treatments": [{
          "id": 1,
          "name": "Treatment1"
        }, {
          "id": 2,
          "name": "Treatment2"
        }]
      };

      var expextedStudyMap = {
        'Study1': {
          arms: {
            'Treatment1': {
              "responders": 58,
              "sampleSize": 100
            },
            'Treatment2': {
              "responders": 53,
              "sampleSize": 103
            }
          }
        },
        'Study2': {
          arms: {
            'Treatment1': {
              "responders": 58,
              "sampleSize": 100
            },
            'Treatment2': {
              "responders": 53,
              "sampleSize": 103
            }
          }
        }
      };
      var studyMap;

      beforeEach(inject(function() {
        studyMap = analysisService.problemToStudyMap(problem);
      }));

      it('generate a map of studies with arms', function() {
        expect(studyMap.Study1).toBeDefined();
        expect(studyMap.Study1.arms.Treatment1).toBeDefined();
        expect(studyMap.Study1.arms.Treatment2).toBeDefined();

        expect(studyMap).toEqual(expextedStudyMap);
      });
    });

    describe('transformProblemToNetwork', function() {

      var network;
      var problem = {
        "entries": [{
          "study": "Study1",
          "treatment": 1,
          "responders": 58,
          "sampleSize": 100
        }, {
          "study": "Study1",
          "treatment": 2,
          "responders": 53,
          "sampleSize": 103
        }, {
          "study": "Study2",
          "treatment": 1,
          "responders": 54,
          "sampleSize": 99
        }, {
          "study": "Study2",
          "treatment": 3,
          "responders": 90,
          "sampleSize": 109
        }, {
          "study": "Study3",
          "treatment": 2,
          "responders": 54,
          "sampleSize": 99
        }, {
          "study": "Study3",
          "treatment": 3,
          "responders": 90,
          "sampleSize": 109
        }],
        "treatments": [{
          "id": 1,
          "name": "Treatment1"
        }, {
          "id": 2,
          "name": "Treatment2"
        }, {
          "id": 3,
          "name": "Treatment3"
        }]
      };

      beforeEach(inject(function() {
        network = analysisService.transformProblemToNetwork(problem);
      }));

      it('should transfrom the problem object to a network of of interventions and  edges', function() {

        expect(network.interventions).toBeDefined();
        expect(network.interventions.length).toEqual(3);
        expect(network.interventions[0].name).toBeDefined();
        expect(network.interventions[0].id).toBeDefined();
        expect(network.interventions[0].sampleSize).toBeDefined();

        expect(network.edges).toBeDefined();
        expect(network.edges[0].studies).toBeDefined();
        expect(network.edges[0].studies.length).toEqual(1);
        expect(network.edges[1].studies.length).toEqual(1);
        expect(network.edges[2].studies.length).toEqual(1);
      });
    });

    describe('createPairwiseOptions', function() {
      var options;
      var mockProblem = {
        "entries": [{
          "study": "Study1",
          "treatment": 1,
          "responders": 58,
          "sampleSize": 100
        }, {
          "study": "Study1",
          "treatment": 2,
          "responders": 53,
          "sampleSize": 103
        }, {
          "study": "Study2",
          "treatment": 1,
          "responders": 54,
          "sampleSize": 99
        }, {
          "study": "Study2",
          "treatment": 2,
          "responders": 90,
          "sampleSize": 109
        }, {
          "study": "Study3",
          "treatment": 2,
          "responders": 54,
          "sampleSize": 99
        }, {
          "study": "Study3",
          "treatment": 3,
          "responders": 90,
          "sampleSize": 109
        }],
        "treatments": [{
          "id": 1,
          "name": "Treatment1"
        }, {
          "id": 2,
          "name": "Treatment2"
        }, {
          "id": 3,
          "name": "Treatment3"
        }]
      };

      beforeEach(function() {
        options = analysisService.createPairwiseOptions(mockProblem);
      });

      it('should create the options for pairwise comparisons from the analysis promise', function() {
        expect(options.length).toBe(1);
        expect(options[0].label).toEqual('Treatment1 - Treatment2');
      });
    });

    describe('estimateRunLength for a random-effects network model', function() {
      var runLength;
      var problem = {
        entries: [{
          study: "Study1"
        }, {
          study: "Study1"
        }, {
          study: "Study2"
        }, {
          study: "Study2"
        }, {
          study: "Study2"
        }, {
          study: "Study3"
        }, {
          study: "Study3"
        }],
        treatments: [{
          id: 1
        }, {
          id: 2
        }, {
          id: 3
        }]
      };
      var model = {
        linearModel: 'random',
        modelType: {
          type: 'network'
        },
        burnInIterations: 50000,
        inferenceIterations: 80000,
        thinningFactor: 5
      };

      beforeEach(function() {
        runLength = analysisService.estimateRunLength(problem, model);
      });

      it('should estimate the run length from the problem and run length settings', function() {
        expect(runLength).toBeCloseTo(40);
      });
    });

    describe('estimateRunLength for a random-effects pairwise model', function() {
      var runLength;
      var problem = {
        entries: [{
          study: "Study1",
          treatment: 1
        }, {
          study: "Study1",
          treatment: 2
        }, {
          study: "Study2",
          treatment: 1
        }, {
          study: "Study2",
          treatment: 2
        }, {
          study: "Study2",
          treatment: 3
        }, {
          study: "Study3",
          treatment: 1
        }, {
          study: "Study3",
          treatment: 3
        }],
        treatments: [{
          id: 1,
          name: 'treatment 1'
        }, {
          id: 2,
          name: 'treatment 2'
        }, {
          id: 3,
          name: 'treatment 3'
        }]
      };
      var model = {
        linearModel: 'random',
        modelType: {
          type: 'pairwise',
          details: {
            from: {
              name: 'treatment 1'
            },
            to: {
              name: 'treatment 2'
            }
          }
        },
        burnInIterations: 50000,
        inferenceIterations: 80000,
        thinningFactor: 5
      };

      beforeEach(function() {
        runLength = analysisService.estimateRunLength(problem, model);
      });

      it('should estimate the run length from the problem and run length settings', function() {
        expect(runLength).toBeCloseTo(25.572);
      });
    });

    describe('estimateRunLength for a fixed-effect network model', function() {
      var runLength;
      var problem = {
        entries: [{
          study: "Study1"
        }, {
          study: "Study1"
        }, {
          study: "Study2"
        }, {
          study: "Study2"
        }, {
          study: "Study2"
        }, {
          study: "Study3"
        }, {
          study: "Study3"
        }],
        treatments: [{
          id: 1
        }, {
          id: 2
        }, {
          id: 3
        }]
      };
      var model = {
        linearModel: 'fixed',
        modelType: {
          type: 'network'
        },
        burnInIterations: 50000,
        inferenceIterations: 80000,
        thinningFactor: 5
      };

      beforeEach(function() {
        runLength = analysisService.estimateRunLength(problem, model);
      });

      it('should estimate the run length from the problem and run length settings', function() {
        expect(runLength).toBeCloseTo(17.971);
      });
    });

    describe('createNodeSplitOptions', function() {
      var nodeSplitOptions;
      describe('for two-treatment network', function() {
        beforeEach(function() {
          var problem = {
            entries: [{
              study: 'study1',
              treatment: 1
            }, {
              study: 'study1',
              treatment: 2
            }],
            treatments: [{
              id: 1,
              name: 'treatment 1'
            }, {
              id: 2,
              name: 'treatment 2'
            }]
          };
          nodeSplitOptions = analysisService.createNodeSplitOptions(problem);
        });

        it('should find zero nodeSplitOptions', function() {
          expect(nodeSplitOptions.length).toBe(0);
        });
      });
      describe('for a fully connected triangle', function() {
        beforeEach(function() {
          var problem = {
            entries: [{
              study: 'study1',
              treatment: 1
            }, {
              study: 'study1',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 1
            }],
            treatments: [{
              id: 1,
              name: 'treatment 1'
            }, {
              id: 2,
              name: 'treatment 2'
            }, {
              id: 3,
              name: 'treatment 3'
            }]
          };
          nodeSplitOptions = analysisService.createNodeSplitOptions(problem);
        });

        it('should find three nodeSplitOptions', function() {
          expect(nodeSplitOptions.length).toBe(3);
        });
      });
      describe('for a star connected triangle', function() {
        beforeEach(function() {
          var problem = {
            entries: [{
              study: 'study1',
              treatment: 1
            }, {
              study: 'study1',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 2
            }, {
              study: 'study3',
              treatment: 4
            }],
            treatments: [{
              id: 1,
              name: 'treatment 1'
            }, {
              id: 2,
              name: 'treatment 2'
            }, {
              id: 3,
              name: 'treatment 3'
            }, {
              id: 4,
              name: 'treatment 4'
            }]
          };
          nodeSplitOptions = analysisService.createNodeSplitOptions(problem);
        });

        it('should find zero nodeSplitOptions', function() {
          expect(nodeSplitOptions.length).toBe(0);
        });
      });
      describe('for a fully connected triangle with one extra', function() {
        beforeEach(function() {
          var problem = {
            entries: [{
              study: 'study1',
              treatment: 1
            }, {
              study: 'study1',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 1
            }, {
              study: 'study 4',
              treatment: 3
            }, {
              study: 'study 4',
              treatment: 4
            }],
            treatments: [{
              id: 1,
              name: 'treatment 1'
            }, {
              id: 2,
              name: 'treatment 2'
            }, {
              id: 3,
              name: 'treatment 3'
            }, {
              id: 4,
              name: 'treatment 4'
            }]
          };
          nodeSplitOptions = analysisService.createNodeSplitOptions(problem);
        });

        it('should find three nodeSplitOptions', function() {
          expect(nodeSplitOptions.length).toBe(3);
        });
      });


      describe(' a very long path in a simple network ( a) ', function() {
        beforeEach(function() {
          var lineLength = 100;
          var problem = {
            entries: [],
            treatments: []
          };

          for (var i = 0; i < lineLength; i++) {
            problem.entries.push({
              study: 's' + i,
              treatment: 't' + i
            });
            problem.entries.push({
              study: 's' + i,
              treatment: 't' + (i + 1)
            });
            problem.treatments.push({
              id: 't' + i,
              name: 't' + i
            });
          }

          problem.treatments.push({
            id: 't' + lineLength,
            name: 't' + lineLength
          });


          nodeSplitOptions = analysisService.createNodeSplitOptions(problem);
        });

        it('should find no nodeSplitOptions and crash at some point', function() {
          expect(nodeSplitOptions.length).toBe(0);
        });
      });

      describe('for a fully connected triangle with one multi-arm study', function() {
        beforeEach(function() {
          var problem = {
            entries: [{
              study: 'study1',
              treatment: 1
            }, {
              study: 'study1',
              treatment: 2
            }, {
              study: 'study1',
              treatment: 3
            }, {
              study: 'study2',
              treatment: 2
            }, {
              study: 'study2',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 3
            }, {
              study: 'study3',
              treatment: 1
            }],
            treatments: [{
              id: 1,
              name: 'treatment 1'
            }, {
              id: 2,
              name: 'treatment 2'
            }, {
              id: 3,
              name: 'treatment 3'
            }]
          };
          nodeSplitOptions = analysisService.createNodeSplitOptions(problem);
        });

        it('should find one nodeSplitOption', function() {
          expect(nodeSplitOptions.length).toBe(1);
        });
      });
    });

    describe('createLikelihoodLinkOptions', function() {

      it('should create 5 options having a title, likelihood and compatibility', function() {
        var problem = {
          "entries": [{
            "study": "Rudolph and Feiger, 1999",
            "treatment": 4,
            "sampleSize": 100,
            "responders": 58
          }, {
            "study": "Rudolph and Feiger, 1999",
            "treatment": 2,
            "sampleSize": 103,
            "responders": 53
          }]
        };
        var likelihoodLinkOptions = analysisService.createLikelihoodLinkOptions(problem);
        expect(likelihoodLinkOptions.length).toBe(5);

        expect(likelihoodLinkOptions[0].likelihood).toBe('normal');
        expect(likelihoodLinkOptions[0].link).toBe('identity');
        expect(likelihoodLinkOptions[0].scale).toBe('mean difference');
        expect(likelihoodLinkOptions[0].label).toBe('normal/identity (mean difference)');
        expect(likelihoodLinkOptions[0].compatibility).toBe('incompatible');

        expect(likelihoodLinkOptions[1].label).toBe('binom/logit (odds ratio)');
        expect(likelihoodLinkOptions[1].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[2].label).toBe('binom/log (risk ratio)');
        expect(likelihoodLinkOptions[2].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[3].label).toBe('binom/cloglog (hazard ratio)');
        expect(likelihoodLinkOptions[3].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[4].label).toBe('poisson/log (hazard ratio)');
        expect(likelihoodLinkOptions[4].compatibility).toBe('incompatible');
      });


      it('should create 5 options having a title, likelihood and compatibility', function() {

        var problem = {
          "entries": [{
            "study": "Rudolph and Feiger, 1999",
            "treatment": 4,
            "mean": 100,
            "std.err": 58
          }]
        };

        var likelihoodLinkOptions = analysisService.createLikelihoodLinkOptions(problem);

        expect(likelihoodLinkOptions[0].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[1].compatibility).toBe('incompatible');
        expect(likelihoodLinkOptions[2].compatibility).toBe('incompatible');
        expect(likelihoodLinkOptions[3].compatibility).toBe('incompatible');
        expect(likelihoodLinkOptions[4].compatibility).toBe('incompatible');
      });

      it('should allow everything for zero entries (ie. most likely a relative effects problem)', function() {

        var problem = {
          entries: []
        };

        var likelihoodLinkOptions = analysisService.createLikelihoodLinkOptions(problem);

        expect(likelihoodLinkOptions[0].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[1].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[2].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[3].compatibility).toBe('compatible');
        expect(likelihoodLinkOptions[4].compatibility).toBe('compatible');

      });
    });

    describe('getScaleName', function() {

      it('should return the appropriate scale', function() {
        var model = {
          likelihood: 'binom',
          link: 'log'
        };
        var scale = analysisService.getScaleName(model);
        expect(scale).toEqual('risk ratio');

      });
    });
  });
});
