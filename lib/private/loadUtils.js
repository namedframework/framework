'use strict';
// Load Models Configuration
const readdir = require('recursive-readdir');
const path = require('path');
const async = require('async');
const _ = require('lodash');

module.exports = function (Framework, callback) {

  // Load utils
  let utilsPath = path.join(Framework.appPath, 'lib/utils');

  readdir(utilsPath, function (err, utils) {
    if (err || !utils || utils.length == 0){
      return callback();
    }

    async.each(utils, function (util, cb) {
      if ( /\.js$/.test(util) ){

        let utilConfig,
        nameArr = util.split(path.sep),
        utilName = nameArr[nameArr.length - 1].replace(/\.js$/, '').trim();

        // try to require
        try {
          utilConfig = require(util);
        } catch (e) {
           console.log(e);
        }

        if (utilConfig){
          if(_.isFunction(utilConfig) && !Framework.utils[utilName]){
             Framework.utils[utilName] = utilConfig;
          }else if (_.isPlainObject(utilConfig)) {
            _.merge(Framework.utils, utilConfig);
          }
        }
      }
      cb();
    }, callback);

  });
};
