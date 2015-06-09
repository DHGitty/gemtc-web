var logger = require('./logger');
var db = require('./db');

module.exports = {
  get: function(analysisId, callback) {
    db.query('SELECT * FROM analysis WHERE ID=$1', [analysisId], function(error, result) {
      if (error) {
        logger.error('error at db.get, error: ' + error);
      }
      callback(error, result);
    });
  },
  query: function(ownerAccountId, callback) {
    logger.debug('get analyses for owner ' + ownerAccountId);
    db.query('SELECT * FROM analysis WHERE OWNER=$1', [ownerAccountId], function(error, result) {
      if (error) {
        logger.error('error at db.query, error: ' + error);
      }
      callback(error, result);
    });
  },
  create: createAnalysis
};

function createAnalysis(ownerAccountId, newAnalysis, callback) {

  db.query('INSERT INTO analysis (title, outcome, problem, owner) VALUES($1, $2, $3, $4) RETURNING id', [newAnalysis.title,
      newAnalysis.outcome,
      newAnalysis.problem,
      ownerAccountId
    ],
    callback);
}