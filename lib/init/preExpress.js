const path = require('path');
const express = require('express');

const utils = require('../private/utils');

module.exports = function (callback) {
  const app = this.app = express();

  app.set('port', this.config.http.port);

  // default view engine
  app.set('views', path.join(this.appPath, this.config.http.viewPath));
  app.set('view engine', this.config.http.viewEngine);

  // set static files path
  app.use(express.static(path.join(this.appPath, this.config.http.public)));

  app.disable('x-powered-by');

  const expressConfigFile = path.join(this.appPath, 'config', 'server', 'express.js');

  if ( utils.fileExists(expressConfigFile) ){

    const config = utils.tryRequire(expressConfigFile);
    if (config) config(app);

  }

  return callback();
};
