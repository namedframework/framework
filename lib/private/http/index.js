'use strict';

const _ = require('lodash');
const async = require('async');
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const multer = require('multer');

const loadRoutes = require('./loadRoutes');
const loadMiddlewares = require('./loadMiddlewares');


module.exports = function (Framework, callback) {

  const app = Framework.app = express();

  /**
  * Express configuration.
  */
  app.set('port', Framework.config.http.port);
  app.set('views', path.join(Framework.appPath, 'views'));
  app.set('view engine', Framework.config.http.viewEngine);
  app.use(express.static(path.join(Framework.appPath, Framework.config.http.public)));

  app.disable('x-powered-by');

  app.use( bodyParser.json() );
  app.use( bodyParser.urlencoded({ extended: true }) );

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: Framework.config.session.secret,
    store: new MongoStore({
      url: Framework.config.session.uri || Framework.config.mongo.uri,
      autoReconnect: true,
    }),
  }));

  async.series([

    function (cb) {
      /**
      * User Express configuration
      */
      let userConfig;
      let expressConfigPath = path.join(Framework.appPath, 'config/server/express');

      try {
        fs.accessSync(expressConfigPath);
      } catch (e) {
        // do nothing
       }finally {
        try {
          userConfig = require( expressConfigPath );
        } catch (e) {
          console.log(e);
        }
      }

      if (userConfig && _.isFunction(userConfig)){
        userConfig(app);
      }
      cb();
    },

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
