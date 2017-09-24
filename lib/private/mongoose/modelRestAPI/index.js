'use strict'
const _ = require('lodash');
const getById = require('./actions/getById');
const get = require('./actions/get');

module.exports = function (options) {
  const Framework = options.Framework;
  const modelConfig = options.modelConfig;
  const modelName = options.modelName;

  // if disabled for model
  if (modelConfig.api === false || (modelConfig.api && modelConfig.api.enable === false) ){
    return;
  }

  const basepath = Framework.config.api.path;

  let apiConfig = {
    get: true,
    post: true,
    delete: true,
    put: true,
  };

  if (_.isPlainObject(Framework.config.api.enable)) {

    apiConfig = Framework.config.api.enable;

  }else if (modelConfig.api && _.isPlainObject(modelConfig.api.enable)) {

    apiConfig = modelConfig.api.enable;

  }

  // console.log(apiConfig);

  // if (modelConfig.api.enable === false){
  //   return callback();
  // }

  const collection = Framework.models[modelName].collection.name;

  const baseRoute = basepath + '/' + collection;

  // get routes
  // get
  Framework.app.get(baseRoute, get(modelName) );
  // getById
  Framework.app.get(baseRoute + '/:id', getById(modelName) );



  // save to api routes list
  Framework.apiroutes.get.push(baseRoute);
  Framework.apiroutes.get.push(baseRoute + '/:id');

  // console.log(Framework.apiroutes);

};
