'use strict';

const async = require('async');
const http = require('http');
const path = require('path');
const fs = require('fs');

const loadConfig = require('./private/loadConfig');
const loadUtils = require('./private/loadUtils');
const startMongoose = require('./private/mongoose');
const startHttp = require('./private/http/index');
const loadRouteError = require('./private/http/loadRouteError');
const loadCron = require('./private/loadCron');
const runBootScripts = require('./private/runBootScripts');

module.exports = function (Framework) {

  async.series([
    function (cb) {
      loadUtils(Framework, cb);
    },
    function (cb) {
      loadConfig(Framework, cb);
    },
    function (cb) {
      // start http before mongoose for rest api
      startHttp(Framework, cb)
    },
    function (cb) {
      startMongoose(Framework, cb);
    },
    function (cb) {
      loadRouteError(Framework, cb);
    },

    // run boot scripts like cron or other initalization 
    function (cb) {
      runBootScripts(Framework, cb);
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
