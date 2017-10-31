'use strict';
// Load Framework Configuration
const fs = require('fs');
const path = require('path');
const async = require('async');
const _ = require('lodash');

module.exports = function (Framework, callback) {

  // Load configuration files
  let configPath = path.join(Framework.appPath, 'config');

  async.series([
    function (cb) {
      fs.readdir(configPath, function (err, files) {
        if (err || !files || files.length == 0){
          return callback();
        }

        async.each(files, function (file, fn) {
          if ( /\.js$/.test(file) ){

            let cfg, filePath = path.join(configPath, file);

            // try to require
            try {
              cfg = require(filePath);
            } catch (e) {
               console.log(e);
            }

            if (cfg && _.isPlainObject(cfg)){
              _.merge(Framework.config, cfg);
            }
          }
          fn();
        }, function (err) {
          return cb();
        })

      });
    },
    // override with local.js
    function (cb) {
      let localConfigPath = path.join(configPath, 'local.js'), localConfig;

      try {
        localConfig = require( localConfigPath );
      } catch (e) {
        if (e.code !== 'ENOENT') console.log(e);
      }

      if (localConfig && _.isPlainObject(localConfig)){
        _.merge(Framework.config, localConfig);
      }
      cb();
    }
  ], callback)


};
