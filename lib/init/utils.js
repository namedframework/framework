const path = require('path');

const utils = require('../private/utils');

module.exports = function (callback) {

  const Framework = this;

  const utilsPath = path.join(Framework.appPath, 'lib', 'utils');

  // check if directory exists
  if ( !utils.fileExists(utilsPath) ){
    return callback();
  }

  // read directory recursively
  utils.readdir_recursive(utilsPath, function (err, files) {

    async.each(files, function (file, fn) {

      if ( utils.isJSFile(file) ) {

        // create full path
        // const file = path.join(utilsPath, f);

        // try to require
        const util = utils.tryRequire(file);

        // if object merge utils
        if ( util && _.isPlainObject(util) ) {
          _.merge(Framework.utils, util);

        // if util is function use filename as key
        }else if ( util && _.isFunction(util) ) {
          const fullname = file.replace(/\.js$/, '').trim();
          const name = fullname.split(path.sep).pop();

          Framework.utils[name] = util;
        }

      }

      fn();
    }, callback);
  });

};
