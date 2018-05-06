const path = require('path');

const utils = require('../private/utils');

module.exports = function (callback) {

  const Framework = this;

  const bootPath = path.join(Framework.appPath, 'server', 'boot');

  // check if config directory exists
  if ( !utils.fileExists(bootPath) ){
    return callback();
  }

  // read directory
  utils.readdir(bootPath, function (err, files) {

    // sort files by name
    files = files.sort((a, b) => a.toLowerCase() > b.toLowerCase());

    // run each files in series to preserve execution order
    async.eachSeries(files, function (f, fn) {

      // ignore non js and local.js file
      if ( utils.isJSFile(f) ) {

        // create full path
        const file = path.join(bootPath, f);

        // try to require
        const bootFun = utils.tryRequire(file);

        // run script
        if ( bootFun && _.isFunction(bootFun) ) {
          // bootscrips must run callback function received as first argument
          // this points to Framework or can call Framework directory from global 
          bootFun.call(Framework, fn);
        }else {
          return fn();
        }
      }else {
        return fn();
      }

    }, function (err) {

      return callback();
    });

  });

};
