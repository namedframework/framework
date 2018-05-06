const path = require('path');

const utils = require('../private/utils');
const associateMiddleware = require('./associateMiddleware');

module.exports = function (callback) {

  const Framework = this;

  const middlewareFile = path.join(Framework.appPath, 'config', 'server', 'middlewares.js');

  // check if config directory exists
  if ( !utils.fileExists(middlewareFile) ){
    return callback();
  }

  const middlewaresConfig = utils.tryRequire(middlewareFile);

  if (middlewaresConfig && _.isPlainObject(middlewaresConfig)){
    _.forEach(middlewaresConfig, function (name, route) {
      // console.log(arguments);
      if (_.isString(name)){
        associateMiddleware(name, route)
      }
      else if (_.isArray(name)) {
        _.forEach(name, function (n) {
          associateMiddleware(n, route);
        });
      }
    });
  }

  return callback();

};
