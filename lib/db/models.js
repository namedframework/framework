const path = require('path');
const readdir = require('recursive-readdir');

const utils = require('../private/utils/index')

const invalidMethods = [
  "on", "emit", "_events", "db", "get", "set", "init", "isNew", "errors",
  "schema", "options", "modelName", "collection", "_pres", "_posts", "toObject",
];

module.exports = function (callback) {

  const modelsPath = path.join(Framework.appPath, 'server', 'models');

  readdir(modelsPath, (err, models) => {
    if (err || !models || models.length == 0){
      return callback();
    }

    async.each(models, (file, fn) => {

      // ignore non js and local.js file
      if ( utils.isJSFile(file) ) {
        // try to require
        const model = utils.tryRequire(file);

        if (model && _.isPlainObject(model) && model.schema){
          const fname = file.split(path.sep)
          const name = fname[fname.length - 1].replace(/\.js$/, '').trim();

          const schema = new this.mongoose.Schema(model.schema, model.options || {});

          /*
          # load pre hooks / middlewares
          */
          if (model.pre){
            _.forEach(model.pre, function (handler, name) {
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
          if (model.post){
            _.forEach(model.post, function (handler, name) {
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
          if (model.virtuals){
            _.forEach(model.virtuals, function (name, obj) {
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
          if (model.statics){
            _.forEach(model.statics, function (handler, name) {
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
          if (model.methods){
            _.forEach(model.methods, function (handler, name) {
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
          if (model.queryHelpers){
            _.forEach(model.queryHelpers, function (handler, name) {
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
          if (model.indexes){
            if (_.isArray(model.indexes)){
              _.forEach(model.indexes, function (index) {
                if (
                  _.isPlainObject(index)
                ){
                  schema.index(index);
                }
              });
            }
          }

          // create model
          this.mongoose.model(name, schema);

        }
      }
      fn();
    }, callback);
  });

};
