'use strict'
const _ = require('lodash');
const getByIdAction = require('./actions/getById');
const getAction = require('./actions/get');
const postAction = require('./actions/post');
const createAction = require('./actions/create');
const deleteAction = require('./actions/delete');
const apiAuthCheck = require('./middlewares/check');

module.exports = function (options) {
  const Framework = options.Framework;
  const modelConfig = options.modelConfig;
  const authConfig = options.authConfig;
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

  let modelAuthConfig = {
    get: false,
    post: false,
    delete: false,
    put: false,
  };

  // if (_.isPlainObject(Framework.config.api.auth)) {
  //
  //   modelAuthConfig = Framework.config.api.auth;
  //
  // }
  // if (Framework.config.api.auth === true ) {
  //
  //   modelAuthConfig = {
  //     get: true,
  //     post: true,
  //     delete: true,
  //     put: true,
  //   }
  //
  // }

  if (modelConfig.api && _.isPlainObject(modelConfig.api.auth)) {

    modelAuthConfig = modelConfig.api.auth;

  }
  if (modelConfig.api && modelConfig.api.auth === true) {

    modelAuthConfig = {
      get: true,
      post: true,
      delete: true,
      put: true,
    }

  }

  // console.log(modelConfig.api, modelName);

  // if (modelConfig.api.enable === false){
  //   return callback();
  // }

  const collection = Framework.models[modelName].collection.name;

  const baseRoute = basepath + '/' + collection;

  // get
  if (apiConfig.get){
    Framework.app.get(baseRoute, apiAuthCheck(authConfig, !modelAuthConfig['get']), getAction(modelName) );
    Framework.app.get(baseRoute + '/:id', apiAuthCheck(authConfig, !modelAuthConfig['get']), getByIdAction(modelName) );

    Framework.apiroutes[modelName].get.push(baseRoute);
    Framework.apiroutes[modelName].get.push(baseRoute + '/:id');
  }

  // post
  if (apiConfig.post){
    // create
    Framework.app.post(baseRoute, apiAuthCheck(authConfig, !modelAuthConfig['post']), createAction(modelName) );
    Framework.apiroutes[modelName].post.push(baseRoute);

    // update
    Framework.app.post(baseRoute + '/:id', apiAuthCheck(authConfig, !modelAuthConfig['post']), postAction(modelName) );
    Framework.apiroutes[modelName].post.push(baseRoute + '/:id');
  }

  // delete
  if (apiConfig.delete){
    Framework.app.delete(baseRoute + '/:id', apiAuthCheck(authConfig, !modelAuthConfig['delete']), deleteAction(modelName) );
    Framework.apiroutes[modelName].delete.push(baseRoute + '/:id');
  }

};
