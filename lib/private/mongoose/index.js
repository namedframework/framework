'use strict';
const readdir = require('recursive-readdir');
const path = require('path');
const lodash = require('lodash');

const mongoose = require('mongoose');
const async = require('async');
const loadModels = require('./loadModels');

module.exports = function (Framework, callback) {

  mongoose.Promise = global.Promise;
  async.series([
    // connect mongo
    function (cb) {
      mongoose.connect(Framework.config.mongo.uri, {
        // DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, set the `useMongoClient` option if using `connect()`
        useMongoClient: true,
      }, function (err) {
        if (err){
          console.log('%s MongoDB connection error. Please make sure MongoDB is running.', '✗');
          process.exit();
        }
        Framework.mongoose = mongoose;
        Framework.models = mongoose.models;
        return cb();
      });
    },
    function (cb) {
      // load local global plugins
      loadPlugins(true, cb);
    },
    function (cb) {
      // load global plugins
      loadPlugins(false, cb);
    },
    function (cb) {
      loadModels(Framework, cb);
    },
    function (cb) {
      return cb();
    }
  ], function (err) {
    return callback();
  });

};


var loadPlugins = function (local, callback) {
  let pluginsPath = path.resolve(Framework.appPath, 'server/plugins/mongoose');
  if (local){
    pluginsPath = path.resolve(__dirname, 'plugins');
  }

  readdir(pluginsPath, function (err, plugins) {
    if (err || !plugins || plugins.length == 0){
      return callback();
    }

    async.each(plugins, function (plugin, cb) {
      if ( /\.js$/.test(plugin) ){

        let pluginFunction;

        // try to require
        try {
          pluginFunction = require(plugin);
        } catch (e) {
          if (e.code !== 'MODULE_NOT_FOUND') console.log(e);
        }

        if (pluginFunction && _.isFunction(pluginFunction)){
          mongoose.plugin(pluginFunction);
        }
      }
      cb();
    }, callback);
  });
};
