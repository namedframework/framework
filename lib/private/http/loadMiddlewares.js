'use strict';

const readdir = require('recursive-readdir');
const path = require('path');
const async = require('async');
const _ = require('lodash');
const associateMiddleware = require('./utils/associateMiddleware');

module.exports = function (Framework, callback) {

  // Load top level middlewares
  let middlewares;
  // try to require
  try {
    middlewares = require( path.resolve(Framework.appPath, 'config/server/middlewares.js') );
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') console.log(e);
  }

  if (middlewares && _.isPlainObject(middlewares)){
    _.forEach(middlewares, function (name, route) {
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
