'use strict';
/* eslint no-underscore-dangle: 0 */

var R = require('ramda');

var isBoolean = R.is(Boolean);
var isArray = R.is(Array);
var isFunction = function isFunction(fn) {
  var isNotRamdaPlaceholder = (fn !== R.__);
  return isNotRamdaPlaceholder && R.is(Function, fn);
};

module.exports.isBoolean = isBoolean;
module.exports.isArray = isArray;
module.exports.isFunction = isFunction;
