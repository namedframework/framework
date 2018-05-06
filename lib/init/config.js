const path = require('path');

const utils = require('../private/utils');

module.exports = function (callback) {

  const Framework = this;

  const configPath = path.join(Framework.appPath, 'config');

  // check if config directory exists
  if ( !utils.fileExists(configPath) ){
    return callback();
  }

  // read directory
  utils.readdir(configPath, function (err, files) {

    async.each(files, function (f, fn) {

      // ignore non js and local.js file
      if ( utils.isJSFile(f) && f !== 'local.js' ) {
        
        // create full path
        const file = path.join(configPath, f);

        // try to require
        const cfg = utils.tryRequire(file);

        // merge config
        if ( cfg && _.isPlainObject(cfg) ) _.merge(Framework.config, cfg);
      }

      fn();
    }, function (err) {

      const localConfig = path.join(configPath, 'local.js');
      if ( utils.fileExists(localConfig) ){
        // overriede config with local.js
        const lcfg = utils.tryRequire(localConfig);
        if ( lcfg && _.isPlainObject(lcfg) ) _.merge(Framework.config, lcfg);
      }

      return callback();
    });

  });

};
