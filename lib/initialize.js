'use strict';

module.exports = function (Framework) {
  Framework.appPath = require('slash')(Framework.appPath || process.cwd());

  // Middlewares Object
  Framework.middlewares = {};

  // utils object
  Framework.utils = {};

  Framework.routes = {
    get: [], put: [], post: [], delete: [], patch: [],
  };

  // default configuration optins
  Framework.config = {
    http: {
      port: 6789,
      viewEngine: 'pug',
      public: 'public'
    },
    mongo: {

    },
    cron: {
      time: '*/45 * * * * *',
    },
    session: {
      secret: 'f109e497a10ff0d2ef10',
      name: 'FRAMEWORK_SESSION',
    }
  };

};
