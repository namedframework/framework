const async = require('async');

const helpers = require('../../../helpers/functions');

module.exports = function (modelName, authConfig) {

  return function (req, res, next) {

    async.waterfall([
      function (cb) {
        if (!req.query.access_token){
          return cb('Facebook access token required.');
        }
        helpers.getFacebookData(req.query.access_token, cb);
      },
      function (json, cb) {
        Framework.models[modelName].findOne({
          'facebook.id': json.id
        }, 'name email', function (err, user) {
          if (err || !user){
            return cb('This Facebook account is not registered with us. Try signing up using facebook.')
          }
          return helpers.signJWTToken({
            modelName: modelName,
            user: user,
            secret: authConfig.secret,
          }, cb);
        });
      },
    ], function (err, token, user) {
      if (err) {
        // console.log(err);
        return res.status(400).json({success: false, message: err});
      }

      res.json({
        success: true,
        message: 'You are logged in using facebook.',
        token: token,
        user: {
          name: user.name,
          email: user.email
        }
      });
    });
  };
};
