module.exports = function (modelName) {

  return function (req, res, next) {
    var query = {}, sortQuery = {}, limit = 10, skip = 0, fields;

    // find query
    var where = req.query.where;
    if ( where && _.isPlainObject(where) ){
      _.forEach(where, function (value, key) {
        if (_.isPlainObject(value) && value.regex ) {
          query[key] = new RegExp(value.regex, 'i');
        }else {
          query[key] = value;
        }
      })
    }

    // sort query
    var sort = req.query.sort;
    if ( sort && _.isPlainObject(sort) ){
      _.forEach(sort, function (value, key) {

        if (isNaN(value) && value.toLowerCase() === 'asc') sortQuery[key] = 1;
        if (isNaN(value) && value.toLowerCase() === 'des') sortQuery[key] = -1;

        if (!isNaN(value) && value > 0) sortQuery[key] = 1;
        if (!isNaN(value) && value <= 0) sortQuery[key] = -1;

      });
    }

    // limit
    if (req.query.limit && !isNaN(req.query.limit) && req.query.limit > 0 && req.query.limit < 100 ){
      limit = parseInt(req.query.limit);
    }

    // skip
    if (req.query.skip && !isNaN(req.query.skip) && req.query.skip > 0 ){
      skip = parseInt(req.query.skip);
    }

    // fields
    if (req.query.fields && _.isString(req.query.fields) ){
      // fields=title name
      // fields=title+name (preferred)
      // fields=title,name
      fields = req.query.fields.replace(/[\,\+]/g, ' ');
    }

    Framework.models[modelName].find(query, fields)
    .sort(sortQuery)
    .limit(limit)
    .skip(skip)
    .exec(function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json(err.message);
      }
      return res.json(result || []);
    });

  };
};
