'use strict';

const _ = require('lodash');
const async = require('async');
const express = require('express');
const http = require('http');
const path = require('path');

const loadRoutes = require('./loadRoutes');
const loadMiddlewares = require('./loadMiddlewares');


module.exports = function (Framework, callback) {

  const app = Framework.app = express();

  let userConfig;

  try {
    userConfig = require( path.resolve(Framework.appPath, 'config/server/express') );
  } catch (e) {
    // do nothing
    if (e.code !== 'MODULE_NOT_FOUND') console.log(e);
  }

  /**
  * Express configuration.
  */
  app.set('port', Framework.config.http.port);
  app.set('views', path.resolve(Framework.appPath, 'views'));
  app.set('view engine', Framework.config.http.viewEngine);
  app.use(express.static(path.join(Framework.appPath, Framework.config.http.public)));

  /**
  * User Express configuration
  */
  if (userConfig && _.isFunction(userConfig)){
    userConfig(app);
  }

  async.series([

    function (cb) {
      /**
      * Load top level middleware policies before routes
      */
      loadMiddlewares(Framework, cb);
    },

    function (cb) {
      /**
      * Load routes and route level middlewares
      */
      loadRoutes(Framework, cb);
    },
  ], function () {
    return callback()
  });

};
