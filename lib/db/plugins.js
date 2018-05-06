const path = require('path');
const utils = require('../private/utils/index')

module.exports = function (callback) {

  const pluginPath = path.join(Framework.appPath, 'server', 'plugins', 'mongoose');

  utils.readdir(pluginPath, (err, files) => {

    if (err || !files){
      return callback();
    }

    // run each files in series to preserve execution order
    async.each(files, (f, fn) => {

      // ignore non js and local.js file
      if ( utils.isJSFile(f) ) {
        // create full path
        const file = path.join(pluginPath, f);

        // try to require
        const plugin = utils.tryRequire(file);

        if (plugin && _.isFunction(plugin)){
          this.mongoose.plugin(plugin);
        }
      }
      fn();
    }, callback);
  });

};
