const https = require('https');
const jwt = require('jsonwebtoken');

module.exports = {
  getFacebookData: function (access_token, callback) {
    https.get('https://graph.facebook.com/me?fields=id,name,email,picture,gender&access_token=' + access_token, function (res ) {

      var data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', function () {
        var json = JSON.parse(data);
        if (json.error){
          return callback(json.error);
        }
        callback(null, json)
      });
    }).on('error', function (err) {
      callback(err || "Failed to get facebook data.");
    });
  },

  signJWTToken: function (options, callback) {
    let data = {
      userId: options.user._id
    }

    jwt.sign(data, options.secret, function (err, token) {
      if (err){
        return callback('Failed to sign token, try again.');
      }
      Framework.models[options.modelName].findByIdAndUpdate(options.user._id, {
        $push: {
          apiTokens: token,
        }
      }, function (err) {
        if (err){
          return callback('Failed save token, try again.');
        }
        return callback(null, token, options.user);
      });
    });
  },
};
