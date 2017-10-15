const fileUploadAction = require('./upload');
const apiAuthCheck = require('../../middlewares/check');

module.exports = function (Framework, authConfig) {
  if (Framework.config.api && Framework.config.api.enable){
    const basepath = Framework.config.api.path;

    Framework.apiroutes['Files API'] = { get: [], post: [], put: [], delete: [] };

    Framework.app.post(basepath + '/files/upload', apiAuthCheck(authConfig, !authConfig.upload), fileUploadAction );
    Framework.apiroutes['Files API'].post.push(basepath + '/files/upload');
  }
};
