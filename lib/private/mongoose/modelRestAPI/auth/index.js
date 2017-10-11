'use strict'
const _ = require('lodash');
const loginAction = require('./actions/login');
const logoutAction = require('./actions/logout');

module.exports = function (options) {
  const Framework = options.Framework;
  // const modelConfig = options.modelConfig;
  const authConfig = options.authConfig;
  const modelName = options.modelName;

  Framework.apiroutes[modelName] = {
    get: [], post: [], delete: [],
    // put: [], patch: [],
  };

  const basepath = Framework.config.api.path;

  const collection = Framework.models[modelName].collection.name;

  const baseRoute = basepath + '/' + collection;

  // login
  Framework.app.post(baseRoute + '/login', loginAction(modelName, authConfig) );
  Framework.apiroutes[modelName].post.push(baseRoute + '/login');
  // logout
  Framework.app.get(baseRoute + '/logout', logoutAction(modelName, authConfig) );
  Framework.apiroutes[modelName].get.push(baseRoute + '/logout');

  // update
  // Framework.app.post(baseRoute + '/:id', postAction(modelName) );
  // Framework.apiroutes[modelName].post.push(baseRoute + '/:id');


};
