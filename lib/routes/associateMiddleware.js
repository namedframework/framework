const path = require('path');

module.exports = associateMiddleware;

function associateMiddleware(middlewareString, routePath, verb = "use") {
  if ( _.isString(middlewareString) ){
    // if parameters
    let nameArr = middlewareString.split(' ');
    let middlewarename = nameArr.shift();

    let middlewareFunction;
    let middlewarePath = path.join(Framework.appPath, 'server', 'middlewares', middlewarename);

    // try to require
    try {
      middlewareFunction = require( middlewarePath );
    } catch (e) {
       console.log(e);
    }
    /**
    * use middleware for route
    */
    if (middlewareFunction){
      if (_.isFunction(middlewareFunction)){

        Framework.app[verb](routePath, middlewareFunction);

      }else if (_.isPlainObject(middlewareFunction) && _.isFunction(middlewareFunction.middleware) ) {
        // if run then execute functions with params
        if (middlewareFunction.run){
          Framework.app[verb](routePath, middlewareFunction.middleware.apply(null, nameArr));
        }else {
          Framework.app[verb](routePath, middlewareFunction.middleware);
        }
      }
    }
  }
}
