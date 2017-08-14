'use strict';
// Load Framework Configuration
const fs = require('fs');
const path = require('path');
const async = require('async');
const _ = require('lodash');

module.exports = function (Framework, callback) {

  // Load configuration files
  let configPath = path.resolve(Framework.appPath, 'config');

  fs.readdir(configPath, function (err, files) {
    if (err || !files || files.length == 0){
      return callback();
    }

    async.each(files, function (file, cb) {
      if ( /\.js$/.test(file) ){

        let cfg, filePath = path.resolve(configPath, file);

        // try to require
        try {
          cfg = require(filePath);
        } catch (e) {
          if (e.code !== 'MODULE_NOT_FOUND') console.log(e);
        }

        if (cfg){
          _.merge(Framework.config, cfg);
        }
      }
      cb();
    }, function (err) {
      return callback();
    })

  })
};
