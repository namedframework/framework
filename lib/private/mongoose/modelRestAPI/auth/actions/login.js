const async = require('async');
const jwt = require('jsonwebtoken');

module.exports = function (modelName, authConfig) {

  return function (req, res, next) {

    async.waterfall([
      function (cb) {
        if (!req.body.email || !req.body.password){
          return cb('Email and password required.');
        }
        Framework.models[modelName].findOne({
          email: req.body.email
        }, function (err, user) {
          if (err || !user) {
            return cb('Invalid email/password combination.');
          }
          return cb(null, user);
        });
      },
      function (user, cb) {
        Framework.models[modelName].validatePassword(req.body.password, user.password, function(err, isValid) {
          if (err) {
            console.log(err);
            return cb('Failed to validate password!');
          }
          if (!isValid) {
            return cb('Invalid email/password combination.');
          }
          return cb(null, user);
        });
      },
      function (user, cb) {
        let data = {
          userId: user._id
        }

        jwt.sign(data, authConfig.secret, function (err, token) {
          if (err){
            return cb('Failed to login, try again.');
          }
          Framework.models[modelName].findByIdAndUpdate(user._id, {
            $push: {
              apiTokens: token,
            }
          }, function (err) {
            if (err){
              return cb('Failed to login, try again.');
            }
            return cb(null, token);
          });
        });
      },
    ], function (err, token) {
      if (err) {
        console.log(err);
        return res.status(401).json({success: false, message: err});
      }

      res.json({success: true, message: 'Login successful.', token: token});
    });
    };
  };
