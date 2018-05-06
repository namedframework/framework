const path = require('path');
const fs = require('fs');


module.exports = {
  getAppPath:  (_rootPath) => {
    var parts = _rootPath.split(path.sep);
    parts.pop(); // get rid of /node_modules from the end of the path
    return parts.join(path.sep);
  },

  isJSFile:  file => {
    return /\.js$/.test(file);
  },

  tryRequire: moduleName => {
    let m;

    // try to require
    try {
      m = require(moduleName);
    } catch (e) {
      console.log(e);
    }
    return m;
  },

  fileExists: file => {

    try {
      fs.accessSync(file);
      return true;
    } catch (e) {
      return false;
    }

  },

  readdir:  (directory, callback) => {
    fs.readdir(directory, callback);
  },



};
