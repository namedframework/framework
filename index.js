const _ = require('lodash');
const async = require('async');

const loadConfig = require('./lib/init/config');
const loadUtils = require('./lib/init/utils');
const preExpress = require('./lib/init/preExpress');
const postExpress = require('./lib/init/postExpress');
const startExpress = require('./lib/init/startExpress');
const loadMiddlewares = require('./lib/routes/middlewares');
const loadRoutes = require('./lib/routes/index');
const bootScripts = require('./lib/init/bootScripts');

// mongoose
const loadDb = require('./lib/db/index');

const getAppPath = require('./lib/private/utils/index').getAppPath;
const moduleRoot = getAppPath(module.parent ? module.parent.paths[0] : module.paths[0]);


// set globals
global.async = require('async');
global._ = require('lodash');


class Framework {

  constructor() {

    // default configuration
    this.config = {
      http: {
        port: 6789,
        public: 'public',
        viewEngine: 'pug',
        viewPath: 'views',
      }
    };
    this.utils = {};
    this.appPath = moduleRoot;
  }

  init(){

    async.series([

      loadConfig.bind(this),
      loadUtils.bind(this),
      loadDb.bind(this),
      preExpress.bind(this),
      loadMiddlewares.bind(this),
      loadRoutes.bind(this),
      postExpress.bind(this),
      bootScripts.bind(this),
      startExpress.bind(this),

    ], function (err) {
      if (err){
        console.error(err);
      }
    });
  }

}

module.exports = global.Framework = new Framework();
