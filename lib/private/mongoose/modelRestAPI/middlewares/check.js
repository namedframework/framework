const async = require('async');
const jwt = require('jsonwebtoken');

module.exports = function (authConfig, disableCheck) {

  return function (req, res, next) {

    if (disableCheck || !_.isPlainObject(authConfig) ) return next();

    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    let userId;

    async.series([
      // validate
      function (cb) {
        if ( Framework.utils.isEmpty(token) ){
          return cb("Authentication token is missing.");
        }
        cb();
      },
      function (cb) {
        jwt.verify(token, authConfig.secret, function (err, decoded) {
          if (err){
            console.log(err);
            return cb('Failed to verify token.')
          }
          // console.log(decoded);
          userId = decoded.userId;
          cb();
        });
      },
      function (cb) {
        Framework.models[authConfig.model].findOne({
          _id: userId,
          apiTokens: token,
        }, '-password')
        .lean()
        .exec(function (err, user) {
          if(err || !user){
            return cb('Failed to verify user token.');
          }
          req.isAuthenticated = true;
          req.user = user;
          req.body.user = user._id;
          return cb();
        });
      }
    ], function (err) {
      if(err){
        return res.status(401).json({error: true, message: err, auth: 'required'});
      }
      return next();
    });
  };


};
