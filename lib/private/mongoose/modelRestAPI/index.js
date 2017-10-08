'use strict'
const _ = require('lodash');
const getByIdAction = require('./actions/getById');
const getAction = require('./actions/get');
const postAction = require('./actions/post');
const createAction = require('./actions/create');
const deleteAction = require('./actions/delete');

module.exports = function (options) {
  const Framework = options.Framework;
  const modelConfig = options.modelConfig;
  const modelName = options.modelName;

  // if disabled for model
  if (modelConfig.api === false || (modelConfig.api && modelConfig.api.enable === false) ){
    return;
  }

  Framework.apiroutes[modelName] = {
    get: [], post: [], delete: [],
    // put: [], patch: [],
  };

  const basepath = Framework.config.api.path;

  let apiConfig = {
    get: true,
    post: true,
    delete: true,
    put: true,
  };

  if (_.isPlainObject(Framework.config.api.enable)) {

    apiConfig = Framework.config.api.enable;

  }

  if (modelConfig.api && _.isPlainObject(modelConfig.api.enable)) {

    apiConfig = modelConfig.api.enable;

  }

  // console.log(apiConfig);

  // if (modelConfig.api.enable === false){
  //   return callback();
  // }

  const collection = Framework.models[modelName].collection.name;

  const baseRoute = basepath + '/' + collection;

  // get
  if (apiConfig.get){
    Framework.app.get(baseRoute, getAction(modelName) );
    Framework.app.get(baseRoute + '/:id', getByIdAction(modelName) );

    Framework.apiroutes[modelName].get.push(baseRoute);
    Framework.apiroutes[modelName].get.push(baseRoute + '/:id');
  }

  // post
  if (apiConfig.post){
    // create
    Framework.app.post(baseRoute, createAction(modelName) );
    Framework.apiroutes[modelName].post.push(baseRoute);

    // update
    Framework.app.post(baseRoute + '/:id', postAction(modelName) );
    Framework.apiroutes[modelName].post.push(baseRoute + '/:id');
  }

  // delete
  if (apiConfig.delete){
    Framework.app.delete(baseRoute + '/:id', deleteAction(modelName) );
    Framework.apiroutes[modelName].delete.push(baseRoute + '/:id');
  }

};
