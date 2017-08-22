'use strict';
// Load Models Configuration
const readdir = require('recursive-readdir');
const path = require('path');
const async = require('async');
const _ = require('lodash');

const invalidMethods = [
  "on", "emit", "_events", "db", "get", "set", "init", "isNew", "errors",
  "schema", "options", "modelName", "collection", "_pres", "_posts", "toObject",
];

module.exports = function (Framework, callback) {

  // Load models
  let modelsPath = path.join(Framework.appPath, 'server/models');

  readdir(modelsPath, function (err, models) {
    if (err || !models || models.length == 0){
      return callback();
    }

    async.each(models, function (model, cb) {
      if ( /\.js$/.test(model) ){

        let modelConfig,
        nameArr = model.split(path.sep),
        modelName = nameArr[nameArr.length - 1].replace(/\.js$/, '').trim();

        // try to require
        try {
          modelConfig = require(model);
        } catch (e) {
           console.log(e);
        }

        if (modelConfig){
          let schema = new Framework.mongoose.Schema(modelConfig.schema, modelConfig.options || {});
          /*
          # load pre hooks / middlewares
          */
          if (modelConfig.pre){
            _.forEach(modelConfig.pre, function (name, handler) {
              if (
                ['init', 'validate', 'save', 'remove'].indexOf(name) !== -1
                &&
                _.isFunction(handler)
              ){
                schema.pre(name, handler);
              }
            });
          }

          /*
          # load post hooks / middlewares
          */
          if (modelConfig.post){
            _.forEach(modelConfig.post, function (name, handler) {
              if (
                ['init', 'validate', 'save', 'remove'].indexOf(name) !== -1
                &&
                _.isFunction(handler)
              ){
                schema.post(name, handler);
              }
            });
          }

          /*
          # load virtuals
          */
          if (modelConfig.virtuals){
            _.forEach(modelConfig.virtuals, function (name, obj) {
              if ( obj && obj.set && _.isFunction(obj.set) ){
                schema.virtuals(name).set(handler);
              }
              if ( obj && obj.get && _.isFunction(obj.get) ){
                schema.virtuals(name).get(handler);
              }
            });
          }

          /*
          # load statics
          */
          if (modelConfig.statics){
            _.forEach(modelConfig.statics, function (handler, name) {
              if (
                invalidMethods.indexOf(name) === -1
                &&
                _.isFunction(handler)
              ){
                schema.statics[name] = handler;
              }
            });
          }
          /*
          # load methods
          */
          if (modelConfig.methods){
            _.forEach(modelConfig.methods, function (name, handler) {
              if (
                invalidMethods.indexOf(name) === -1
                &&
                _.isFunction(handler)
              ){
                schema.methods[name] = handler;
              }
            });
          }
          /*
          # load query helpers
          */
          if (modelConfig.queryHelpers){
            _.forEach(modelConfig.queryHelpers, function (name, handler) {
              if (
                typeof name === 'string'
                &&
                _.isFunction(handler)
              ){
                schema.query[name] = handler;
              }
            });
          }
          /*
          # Indexes
          */
          if (modelConfig.indexes){
            if (_.isArray(modelConfig.indexes)){
              _.forEach(modelConfig.indexes, function (index) {
                if (
                  _.isPlainObject(index)
                ){
                  schema.index(index);
                }
              });
            }
          }
          Framework.mongoose.model(modelName, schema);
        }
      }
      cb();
    }, callback);

  })
};
