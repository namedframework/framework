const mongoose = require('mongoose');

module.exports = function (callback) {
  const self = this;

  mongoose.connect(this.config.mongo.uri)
    .then(() => {
      self.mongoose = mongoose;
      self.models = mongoose.models;
      callback();
    })
    .catch((err) => {
      console.error(err);
      console.log(err.message);
      console.error('%s MongoDB connection error.', '✗');
      console.error('- Check connection uri or make sure MongoDB is running.');
      console.error('- Remove mongo db connection uri to start without db support.');
      process.exit();
    });
};
