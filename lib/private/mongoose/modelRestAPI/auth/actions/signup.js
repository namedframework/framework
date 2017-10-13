const async = require('async');
const jwt = require('jsonwebtoken');

module.exports = function (modelName, authConfig) {

  return function (req, res, next) {

    async.waterfall([
      function (cb) {
        if (!req.body.name || !req.body.email || !req.body.password){
          return cb('Name, Email and password required.');
        }
        return cb();
      },
      function (cb) {
        Framework.models[modelName].encryptPassword(req.body.password,function(err, hash) {
          if (err) {
            // console.log(err);
            return cb('Failed to validate password!');
          }
          req.body.password = hash;
          return cb();
        });
      },
      function (cb) {
        Framework.models[modelName].create(req.body, function (err, user) {
          if (err || user.length === 0){
            var msg = err.message;
            if (err.name === 'MongoError' && err.code === 11000) {
              msg = 'Email is already registered with us.';
            }
            return cb(msg);
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
            return cb(null, token, user);
          });
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
