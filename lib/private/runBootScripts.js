'use strict';
// Load Framework Configuration
const fs = require('fs');
const path = require('path');
const async = require('async');
const _ = require('lodash');

module.exports = function (Framework, callback) {

  // run boot scripts
  let bootScriptsPath = path.join(Framework.appPath, 'server', 'boot');

  fs.readdir(bootScriptsPath, function (err, files) {
    if (err || !files || files.length == 0){
      return callback();
    }

    async.each(files, function (file, fn) {
      if ( /\.js$/.test(file) ){

        let bootFunction, filePath = path.join(bootScriptsPath, file);

        // try to require
        try {
          bootFunction = require(filePath);
        } catch (e) {
          console.log(e);
        }

        if (bootFunction && _.isFunction(bootFunction)){
          // callback must be called from boot script
          bootFunction(Framework, function (err) {
            // ignore error from script 
            if (err) console.log(err);
            fn();
          });
        }else {
          fn();
        }
      }else {
        fn();
      }
    }, function (err) {
      return callback();
    })

  });

};
