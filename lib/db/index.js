const connectMongo = require('./connect');
const loadPlugins = require('./plugins');
const loadModels = require('./models');

module.exports = function (callback) {
  if (!this.config.mongo || !this.config.mongo.uri ){
    console.log("Mongodb connection uri not found, proceding without db support.");
    return callback();
  }

  async.series([
    // connect mongodb
    // load mongoose models
    connectMongo.bind(this),
    loadPlugins.bind(this),
    loadModels.bind(this),
  ], callback);
};
