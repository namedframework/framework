# [namedframework](https://www.namedframework.com)

[![NPM](https://nodei.co/npm/namedframework.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/namedframework/)

## **[Documentation](http://docs.namedframework.com/)**

## Features

* Routes based on directory structure.
* Mongoose models
* Express middlewares made easy
* Easy Configuration

## Starter Features

* User login.
  * Local (Email / Password)
  * Social (Facebook and Google)
* User Profile
* Admin Login
* Admin Panel
  * Dashboard
  * Admins
  * Users

## Built With
* [Express](http://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [Mongoose](http://mongoosejs.com/) - elegant mongodb object modeling for node.js

## Getting Started
```
$ git clone https://github.com/namedframework/starter.git
$ cd starter
$ npm install
$ npm start
```

Insert admin user in collection _admins_

* Username : **admin**
* Password : **1234**

```json
{
    "name" : "Admin User",
    "username" : "admin",
    "password" : "$2a$10$DzHAK3xEi0YvtRF49BfQlebwFuttlfmlzPWf0cB0XGZJurRGcBJKm"
}
```

* Browse [http://localhost:6789](http://localhost:6789)
* Login to Admin [http://localhost:6789/login/admin](http://localhost:6789/login/admin)


## Contributing
Contributions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
