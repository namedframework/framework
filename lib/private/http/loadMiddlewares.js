'use strict';

const readdir = require('recursive-readdir');
const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('lodash');
const associateMiddleware = require('./utils/associateMiddleware');

module.exports = function (Framework, callback) {

  // Load top level middlewares
  let middlewaresConfig, permErr;
  let middlewaresConfigPath = path.join(Framework.appPath, 'config/server/middlewareskk.js');

  try {
    fs.accessSync(middlewaresConfigPath);
  } catch (e) {
    // do nothing
    if (e.code !== 'ENOENT') console.log(e);
    permErr = e;
  }

  if (!permErr){
    try {
      middlewaresConfig = require( middlewaresConfigPath );
    } catch (e) {
      console.log(e);
    }
  }

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
