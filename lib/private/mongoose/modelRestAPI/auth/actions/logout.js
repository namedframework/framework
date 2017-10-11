const async = require('async');
const jwt = require('jsonwebtoken');

module.exports = function (modelName, authConfig) {

  return function (req, res, next) {

    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    let userId;

    async.series([
      function (cb) {
        if ( Framework.utils.isEmpty(token) ){
          return cb("Invalid or Empty token.!!");
        }
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

        Framework.models[modelName].findByIdAndUpdate(userId, {
          $pull: {
            apiTokens: token,
          }
        }, function (err) {
          if (err){
            return cb('Failed to logout, try again.');
          }
          return cb();
        });
      },
    ], function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({success: false, message: err});
      }

      res.json({success: true, message: 'Logout successful.'});
    });
  };
};
