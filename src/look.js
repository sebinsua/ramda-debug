'use strict';
/* eslint no-underscore-dangle: 0 */

var R = require('ramda');
var inspect = require('util-inspect');

var formatters = require('./formatters');

var formatNameAssignment = formatters.formatNameAssignment;
var formatSignature = formatters.formatSignature;

var utils = require('./utils');

var isArray = utils.isArray;
var isFunction = utils.isFunction;

var DEFAULT_ENABLED_STATE = false;

var LAMBDA_SYMBOL = 'λ';
var NEW_LINE = '\n';

var wrappedFnNames = {};
var anonymousFnCounter = 0;

// TODO: Logging should be able to be swapped out.

function getFnName(fn) {
  var fnName = fn.displayName || fn.name;
  if (fnName) {
    return fnName;
  }

  return LAMBDA_SYMBOL + anonymousFnCounter++;
}

function getType(value) {
  /* eslint no-use-before-define: 0 */
  var type;
  if (isArray(value)) {
    var types = getTypes(value);
    var firstType = R.head(types);
    var isAnyTypeDifferent = R.any(R.pipe(R.eq(firstType), R.not));
    if (isAnyTypeDifferent(types)) {
      type = '[Mixed]';
    } else {
      type = '[' + firstType + ']';
    }
  } else {
    type = R.type(value);
  }
  return type;
}

var getTypes = R.map(getType);

function serializeValue(v) {
  if (isFunction(v)) {
    var fnName = getFnName(v);
    return fnName;
  }
  return inspect(v);
}

var serializeValues = R.map(serializeValue);

function generateMethodTypes(argsList, returnValue) {
  var argumentTypes = getTypes(argsList);

  var returnType = getType(returnValue);
  var methodTypes = argumentTypes.concat(returnType);

  return methodTypes;
}

function generateExecutionValues(argsList, returnValue) {
  var executionValues = serializeValues(R.append(returnValue, argsList));

  return executionValues;
}

function getWrappedFn(displayName, fn, lookFn, lookInstance) {
  var w = function wrap(/* arguments */) {
    var returnValue = fn.apply(fn, arguments);

    var isEnabled = lookInstance.enabled;
    if (isEnabled) {
      var argsList = R.values(arguments);

      if (isFunction(returnValue)) {
        var newFnName = displayName;
        if (argsList.length) {
          var oldArgsList = fn._argsList || [];
          var fnArgsList = oldArgsList.concat(argsList);
          newFnName = R.head(newFnName.split('(')).trim();
          newFnName = newFnName + '(' + serializeValues(fnArgsList).join(', ') + ')';
        }
        returnValue.displayName = newFnName;
        returnValue._argsList = fnArgsList;
        returnValue = lookFn(newFnName, returnValue);
      }

      var methodSignature = generateMethodTypes(argsList, returnValue);
      var executionSignature = generateExecutionValues(argsList, returnValue);

      var signatures = formatSignature(displayName, methodSignature, executionSignature, wrappedFnNames);
      console.log(signatures.join(NEW_LINE) + NEW_LINE);
    }

    return returnValue;
  };
  w._fn = fn;
  w.displayName = displayName;
  w._wrapped = true;

  // This is internal and is commented out for now.
  // var fnAssignmentSignature = formatNameAssignment(w.displayName, getFnName(fn), wrappedFnNames);
  // console.log(fnAssignmentSignature + NEW_LINE);

  return w;
}

function rewrapFn(oldFnName, newFnName, fn, lookFn, lookInstance) {
  var isEnabled = lookInstance.enabled;
  if (isEnabled) {
    var fnAssignmentSignature = formatNameAssignment(newFnName, oldFnName, wrappedFnNames);
    console.log(fnAssignmentSignature + NEW_LINE);
  }

  fn._argsList = [];
  return getWrappedFn(newFnName, fn, lookFn, lookInstance);
}

function Look () {
  this.enabled = DEFAULT_ENABLED_STATE;
}

Look.prototype.enable = function enable(enabled) {
  this.enabled = !!enabled;
};

Look.prototype.on = function on() {
  this.enable(true);
};

Look.prototype.off = function off() {
  this.enable(false);
};

/**
 * Wraps the function that you want to be observed.
 *
 * Can be called with `look(fn)` or `look('functionName', fn)`.
 */
Look.prototype.look = function look(fnName, fn) {
  if (isFunction(fnName)) {
    fn = fnName;
    fnName = getFnName(fn);
  }

  wrappedFnNames[fnName] = true;

  var isFnWrapped = !!fn._wrapped;
  var _lookInstance = this;
  var _lookFn = _lookInstance.look.bind(_lookInstance);
  var wrapFn = isFnWrapped ? rewrapFn(fn.displayName, fnName, fn._fn, _lookFn, _lookInstance) : getWrappedFn(fnName, fn, _lookFn, _lookInstance);

  return wrapFn;
};

module.exports = Look;
