const path = require('path');
const readdir = require('recursive-readdir');
const slash = require('slash');

const utils = require('../private/utils');
const associateMiddleware = require('./associateMiddleware');

module.exports = function (callback) {

  const Framework = this;

  const routesPath = path.join(Framework.appPath, 'server', 'routes');

  // check if config directory exists
  if ( !utils.fileExists(routesPath) ){
    return callback();
  }

  // read directory
  readdir(routesPath, function (err, files) {

    async.each(files, function (f, fn) {


      // ignore non js
      if ( utils.isJSFile(f) ) {
        const routeConfig = utils.tryRequire(f);

        if (routeConfig && _.isPlainObject(routeConfig) ){

          const config = routeConfig._config || {};
          let route;
          // override route using config
          if (config.url && _.isString(config.url)){
            route = config.url;
          }else {
            // get path from directory path relative to server/route
            route = f.replace(/\.js$/, '').trim().replace(new RegExp(`${routesPath}/?`), '/');

            // remove trailing index
            // to use directory name as route
            route = route === '/index' ? '/' : route.replace(/\/?index$/, '');

            // append params if any
            if ( config.params && _.isString(config.params) ){
              route += `/:${config.params}`
            }else if ( config.params && _.isArray(config.params) ) {
              route += `/:${config.params.join('/:')}`
            }

          }

          // associate route middleware
          if (config.middleware){
            // if string
            if ( _.isString(config.middleware) ) {
              associateMiddleware(config.middleware, `^${route}\/?$`);
            }else if ( _.isArray(config.middleware) ) {
              // if array of middlewares
              _.forEach(config.middleware, function (name) {
                associateMiddleware(name, `^${route}\/?$`);
              });
            }else if ( _.isPlainObject(config.middleware) ) {
              // if plain object
              const mObj = config.middleware;
              // for all request types
              if (mObj.all){
                if ( _.isString(mObj.all) ) {
                  associateMiddleware(mObj.all, `^${route}\/?$`);
                }else if ( _.isArray(mObj.all) ) {
                  // if array of middlewares
                  _.forEach(mObj.all, function (name) {
                    associateMiddleware(name, `^${route}\/?$`);
                  });
                }
              }

              _.forEach(['get', 'put', 'post', 'delete', 'patch'], function (verb) {
                if ( mObj[verb] ){
                  if (_.isString(mObj[verb]) ) {
                    associateMiddleware(mObj[verb], `^${route}\/?$`, verb);
                  }else if ( _.isArray(mObj[verb]) ) {
                    _.forEach(mObj[verb], function (name) {
                      associateMiddleware(name, `^${route}\/?$`, verb);
                    });
                  }
                }
              });

            }


          }

          // associate routes
          _.forEach(['get', 'put', 'post', 'delete', 'patch'], function (verb) {
            let handler = routeConfig[verb];

            if ( handler && _.isFunction(handler) ){
              // set route handler
              Framework.app[verb](route, handler);
            }
          });

        } // end if routeConfig
      } // end if check file exists

      fn();
    }, function (err) {

      return callback();
    });

  });

};
