'use strict';

// Load Models Configuration
const readdir = require('recursive-readdir');
const path = require('path');
const async = require('async');
const slash = require('slash');
const _ = require('lodash');
const associateMiddleware = require('./utils/associateMiddleware');

module.exports = function (Framework, callback) {

  // Load routes
  let routesPath = path.join(Framework.appPath, 'server/routes/');
  let middlewaresPath = path.join(Framework.appPath, 'server/middlewares/');

  readdir(routesPath, function (err, routes) {
    if (err || !routes || routes.length == 0){
      return callback();
    }

    async.each(routes, function (route, cb) {
      if ( /\.js$/.test(route) ){
        // convert windows path to linux like (\\ to /)
        route = slash(route);

        let routeConfig;
        let routePath = route.replace(/\.js$/, '').trim().replace(new RegExp(`${slash(routesPath)}/?`), '/');

        // try to require
        try {
          routeConfig = require(route);
        } catch (e) {
           console.log(e);
        }

        if (routeConfig){
          let config = routeConfig._config || {};
          // remove trainling /index
          routePath = routePath === '/index' ? '/' : routePath.replace(/\/?index$/, '');

          if ( config.params && _.isString(config.params) ){
            routePath += `/:${config.params}`
          }else if (config.params && _.isArray(config.params)) {
            routePath += `/:${config.params.join('/:')}`
          }

          if (config.url && _.isString(config.url)){
            routePath = config.url;
          }

          if (config.middleware && _.isString(config.middleware)){
            associateMiddleware(config.middleware, `^${routePath}\/?$`)
          }
          else if (config.middleware && _.isArray(config.middleware)) {
            _.forEach(config.middleware, function (name) {
              associateMiddleware(name, `^${routePath}\/?$`);
            });
          }
          // TODO find a way to implement sperate middlewares for get, put, post .....


          _.forEach(['get', 'put', 'post', 'delete', 'patch'], function (verb) {
            let handler = routeConfig[verb];

            if ( handler && _.isFunction(handler) ){

              // add to routes list
              Framework.routes[verb].push(routePath);

              // set route handler
              Framework.app[verb](routePath, handler);
            }
          });
        }
      }
      cb();
    }, callback);

  });

};
