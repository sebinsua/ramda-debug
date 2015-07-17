'use strict';
/* eslint no-underscore-dangle: 0 */

var Look = require('./look');
var wrapFns = require('./wrap');

var lookInstance = new Look();

var look = lookInstance.look.bind(lookInstance);
look.look = look;
look.enable = function enable(enabled) {
  lookInstance.enable(enabled);
  return look;
};
look.on = function on() {
  lookInstance.on();
  return look;
};
look.off = function off() {
  lookInstance.off();
  return look;
};
look.wrap = function wrap(library, enabled) {
  return wrapFns(library, enabled, look);
};
look.fov = function fov(fn) {
  var wrappedFn = look(fn);
  function fieldOfView(/* arguments */) {
    look.on();
    var value = wrappedFn.apply(wrappedFn, arguments);
    look.off();
    return value;
  }
  fieldOfView._fn = fn;
  fieldOfView.displayName = wrappedFn.displayName;
  fieldOfView._wrapped = true;

  return fieldOfView;
};

module.exports = function init(debugFn) {
  lookInstance.setLogger(debugFn);
  return look;
};
