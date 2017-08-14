'use strict';

const FrameworkClass = require('./Framework');

const Framework = new FrameworkClass();

// set global Framework
global.Framework = Framework;

module.exports = Framework;
