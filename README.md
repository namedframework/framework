# namedframework
Named Framework

## Getting Started
```
npm init
npm install --save namedframework
```

## App Structure

* config -> App Configuration files
* lib
  * utils -> general utils (Framework.utils)
* server
  * middlewares -> middlewares definded here
  * models -> mongoose models definded here
  * routes -> routes defined here
    * routes are mapped as directory structure (eg. server/routes/index.js to / , routes/pages/contact to /pages/contact)
  * views -> views files
* app.js

## app.js
```js
// require Framework
var Framework = require('namedframework');

// chdir to app file
process.chdir(__dirname);

global.async = require('async');

global._ = require('lodash');

// fix pm2 path error
Framework.appPath = __dirname;

// start Framework
Framework.init();

```
## Configuration

Edit Configuration files in *config* directory.

* http.js
  * port - default 6789
  * view engine - 'pug'
* mongo.js
  * mongo.uri - mongo connection string
* server/express.js
  * function is called before initializing routes with express **app** as only parameter
* server/middlewares.js
  * map top level routes to middleware's defined at middlewares directory. Single routes middleware's can be mapped at each routes files.


## models

Mongoose models are defined at **server/models**
New model with filename will be saved and can be accessed as Framework.models[filename]

**Sample model** User.js

```js

module.exports = {
  // schema options
  // http://mongoosejs.com/docs/guide.html#options
  options: {
    timestamps: true
  },

  // schema fields
  // http://mongoosejs.com/docs/guide.html
  schema: {
    email: { type: String, unique: true },
    password: String,
    name: String,
    // ......
  },

  pre: {
    save: function save(next) {
      // encrypt password
    },
  },
  post: {
    validate: function save(next) {
      // do something
    },
  },

  methods: {
    comparePassword: function(candidatePassword, cb) {
      // compare it
    }
  },
  virtuals: {
    // virtuals here
  },
  statics: {
    // statics here
  },
  queryHelpers: {
    // queryHelpers here
  },
  indices: {
    // indices here
  },
};
```

## Routes
Routes are defined at **server/routes**

*Sample route <home.js>*

```js
module.exports = {
  _config: {
    middleware: 'checkSession', // ['checkSession', 'auth/isAuthenticated']
    params: 'userid', // /home/:userid
    // params: ['projectid', 'userid'], // /home/:projectid/:userid
    url: '/custom/home/:userid' // complete route path for this route including params  https://expressjs.com/en/guide/routing.html#route-paths
  },
  get: function (req, res, next) {
    var routes = JSON.stringify(Framework.routes, null, 2);

    res.send(`<h1>Named Framework</h1><pre>${routes}</pre>`)
  },
  post: function (req, res, next) {
    res.send(`<h1>Form Submitted</h1><pre>${JSON.stringify(req.body)}</pre>`)
  }
};
```

home.js will be mapped to route /home

## Utils

* lib/utils/* will be mapped to Framework.utils[filename]
* If file exports object it will be merged with Framework.utils

## Run
```
node app.js
```
OR
```
nodemon app.js
```

## Contributing
Contributions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
