'use strict'
const _ = require('lodash');
const getByIdAction = require('./actions/getById');
const getAction = require('./actions/get');
const postAction = require('./actions/post');
const deleteAction = require('./actions/delete');

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
  Framework.app.get(baseRoute, getAction(modelName) );
  // getById
  Framework.app.get(baseRoute + '/:id', getByIdAction(modelName) );

  // post
  Framework.app.post(baseRoute + '/:id', postAction(modelName) );

  // delete
  Framework.app.delete(baseRoute + '/:id', deleteAction(modelName) );

  // save to api routes list
  Framework.apiroutes.get.push(baseRoute);
  Framework.apiroutes.get.push(baseRoute + '/:id');
  Framework.apiroutes.post.push(baseRoute + '/:id');
  Framework.apiroutes.delete.push(baseRoute + '/:id');

  // console.log(Framework.apiroutes);

};
