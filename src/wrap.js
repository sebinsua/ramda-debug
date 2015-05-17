'use strict';

var R = require('ramda');

var utils = require('./utils');

var isBoolean = utils.isBoolean;
var isFunction = utils.isFunction;

function wrapFns(library, enabled, lookFn) {
  if (!library) {
    throw new Error('A library must be passed into ramda-debug#wrap.');
  }

  // Enabled can be an option, or it can be a boolean.
  // If it is undefined it will default to true.
  var isEnabled = true;
  if (isBoolean(enabled)) {
    isEnabled = enabled;
  } else if (enabled && enabled.enabled) {
    isEnabled = enabled.enabled;
  }

  return R.mapObjIndexed(function (v, k/*, o*/) {
    if (isFunction(v) && isEnabled) {
      v = lookFn(k, v);
    }
    return v;
  }, library);
}

module.exports = wrapFns;
