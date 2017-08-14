'use strict';

const initialize = require('./lib/initialize');
const load = require('./lib/load');

// Framework class
class Framework {

  constructor() {
    initialize(this);
  }

  init(){
    load(this);
  }

}


module.exports = Framework;
