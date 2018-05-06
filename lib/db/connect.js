const mongoose = require('mongoose');

module.exports = function (callback) {

  mongoose.connect(this.config.mongo.uri, err => {
    if (err){
      console.log(err.message);
      console.error('%s MongoDB connection error.', '✗');
      console.error('- Check connection uri or make sure MongoDB is running.');
      console.error('- Remove mongo db connection uri to start without db support.');
      process.exit();
    }
    this.mongoose = mongoose;
    this.models = mongoose.models;
    return callback();
  });
};
