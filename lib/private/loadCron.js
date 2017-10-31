'use strict';
const path = require('path');
const fs = require('fs');

module.exports = function (Framework, callback) {

  // var timeString = Framework.config.cron.time;
  var cronPath = path.join(Framework.appPath, 'lib/cron/index.js');
  var cronFun;

  fs.access(cronPath, function (err) {
    if (err) return callback();
    try {
      cronFun = require( cronPath );
    } catch (e) {
      console.log(e);
    }

    if (cronFun && _.isFunction(cronFun) ) {
      cronFun();
    }
    callback();
  });


};
