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
        Framework.models[modelName].find({
          'facebook.id': json.id
        }, function (err, users) {
          if (err || users.length > 0){
            return cb('This Facebook account is already registered with us. Try loggin in using facebook.')
          }
          return cb(null, json);
        });
      },
      function (json, cb) {
        Framework.models[modelName].create({
          facebook: json,
          email: json.email,
          name: json.name,
          gender: json.gender ? json.gender.toUpperCase() : '',
        }, function (err, user) {
          if (err || user.length === 0){
            var msg = err.message;
            if (err.name === 'MongoError' && err.code === 11000) {
              msg = 'Email is already registered with us.';
            }
            return cb(msg);
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
        message: 'Signup successful.',
        token: token,
        user: {
          name: user.name,
          email: user.email
        }
      });
    });
  };
};
