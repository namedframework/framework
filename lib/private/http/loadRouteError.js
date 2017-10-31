'use strict';
const path = require('path');
const fs = require('fs');

module.exports = function (Framework, callback) {

  let httpErrorConfig;
  let httpErrorConfigPath = path.join(Framework.appPath, 'config/server/httperr.js');

  fs.access(httpErrorConfigPath, function (err, perms) {
    if (err) return callback();
    try {
      httpErrorConfig = require( httpErrorConfigPath );
    } catch (e) {
      console.log(e);
    }
    /*
    * User Express configuration
    */
    if (httpErrorConfig && _.isFunction(httpErrorConfig)){
      httpErrorConfig(Framework.app);
    }
    callback();
  });


};
