'use strict';

const async = require('async');
const http = require('http');
const path = require('path');

const loadConfig = require('./private/loadConfig');
const loadUtils = require('./private/loadUtils');
const startMongoose = require('./private/mongoose');
const startHttp = require('./private/http/index');

module.exports = function (Framework) {

  async.series([
    function (cb) {
      loadUtils(Framework, cb);
    },
    function (cb) {
      loadConfig(Framework, cb);
    },
    function (cb) {
      startMongoose(Framework, cb);
    },
    function (cb) {
      startHttp(Framework, cb)
    },
    function (cb) {
      let httpErrorConfig;

      try {
        httpErrorConfig = require( path.resolve(Framework.appPath, 'config/server/httperr') );
      } catch (e) {
        // do nothing
        if (e.code !== 'MODULE_NOT_FOUND') console.log(e);
      }

      /**
      * User Express configuration
      */
      if (httpErrorConfig && _.isFunction(httpErrorConfig)){
        httpErrorConfig(Framework.app);
      }
      cb();
    },
    // schedule cron
    function (cb) {
      // var timeString = Framework.config.cron.time;
      var cronPath = path.join(Framework.appPath, 'lib/cron/index');
      var cronFun;

      try {
        cronFun = require(cronPath);
      } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') console.log(e);
      }
      if (cronFun && _.isFunction(cronFun) ) {
        cronFun();
      }
      cb();
    }
  ], function () {
    const app = Framework.app;
    const server = http.createServer(app);

    /**
    * Start Http server.
    */
    server.listen(app.get('port'));

    server.on('listening', function() {
      console.log('%s App is running at http://localhost:%d in %s mode', '✓', app.get('port'), app.get('env')); 
      console.log('  Press CTRL-C to stop\n');
    });

    /*
    * Handle error
    */
    server.on('error', function(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
        console.error(`Port ${app.get('port')} requires elevated privileges`);
        process.exit(1);
        break;
        case 'EADDRINUSE':
        console.error(`Port ${app.get('port')} is already in use`);
        process.exit(1);
        break;
        default:
        throw error;
      }
    });
  });

};
