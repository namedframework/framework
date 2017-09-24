module.exports = function (modelName) {

  return function (req, res, next) {
    var id = req.params.id;

    Framework.models[modelName].findByIdAndUpdate(id,
      req.body,
      { new: true }, // get updated result
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        res.json(result);
      })
    };
  };
