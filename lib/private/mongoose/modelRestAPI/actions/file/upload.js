const multer = require('multer');
const async = require('async');
var sanitize = require("sanitize-filename");

module.exports =  function (req, res, next) {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate();

  if (month < 10){
    month = '0' + month;
  }

  var destination = Framework.config.http.public + '/' + 'uploads' + '/' + year + '/' + month + '/' + date ;

  async.waterfall([
    // function (cb) {
    //   mkdirp(destination, function (err) {
    //     if (err){
    //       console.log(err);
    //       return cb('Failed to create upload directory, try again.');
    //     }
    //     return cb();
    //   });
    // },
    function (cb) {
      let options ={
        storage: multer.diskStorage({
          destination: destination,
          filename: function (req, file, cb) {
            var name = Math.random().toString(36).substring(6) + '-' + file.originalname.replace(/ /g, '-');
            cb(null, sanitize(name));
          }
        }),
      };

      multer(options).any()(req, res, function (err) {

        // console.log(req.files);

        if (err) {
          console.log(err);
          return cb('Failed to upload files.');
        }

        let files = [];
        req.files.forEach(function (file) {

          files.push( file.path.replace( new RegExp( '^' + Framework.config.http.public), '' ) );
        });
        cb(null, files);
      });

    },
  ], function (err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json({success: false, message: err});
    }
    if (files.length === 1){
      return res.json({success: true, file: files[0]});
    }

    res.json({success: true, files: files});
  })

};
