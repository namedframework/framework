const path = require('path');
const utils = require('../private/utils');

module.exports = function (callback) {

  const postExpressConfigFile = path.join(this.appPath, 'config', 'server', 'httperr.js');

  if ( utils.fileExists(postExpressConfigFile) ){

    const config = utils.tryRequire(postExpressConfigFile);
    if (config) config(this.app);

  }

  return callback();
};
