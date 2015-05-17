'use strict';
/* eslint no-underscore-dangle: 0 */

var R = require('ramda');
var inspect = require('util-inspect');

var hex = require('text-hex');
var crayon = require('@ccheever/crayon');

var utils = require('./utils');

var isArray = utils.isArray;
var isFunction = utils.isFunction;

var DEFAULT_ENABLED_STATE = false;

var fns = {};
var anonymousFnCounter = 0;

var OF_TYPE_SYMBOL = '∷';
var TO_SYMBOL = '→';
var LAMBDA_SYMBOL = 'λ';
var EQUAL_SYMBOL = '=';

var SPACE = ' ';

function logNameAssignment(newFnName, oldFnName) {
  var strToHex = function strToHex(str) {
    return crayon(hex(str))(str);
  };
  var grey = function grey(str) {
    return crayon('#aaa')(str);
  };

  var fnAssignmentSignature = [newFnName, oldFnName].map(function (v) {
    return fns[v] ? strToHex(v) : grey(v);
  }).join(SPACE + grey(EQUAL_SYMBOL) + SPACE);
  console.log(fnAssignmentSignature);

  console.log();
}

function log(fnName, methodTypes, executionValues) {
  var strToHex = function strToHex(str) {
    return crayon(hex(str))(str);
  };
  var grey = function grey(str) {
    return crayon('#aaa')(str);
  };

  var methodSignature = methodTypes.join(SPACE + TO_SYMBOL + SPACE);
  var methodSignatureLine = [
    fns[fnName] ? strToHex(fnName) : fnName,
    OF_TYPE_SYMBOL,
    methodSignature
  ].join(SPACE);
  console.log(methodSignatureLine);

  var emptyness = new Array(fnName.length + 1).join(SPACE);
  var executionSignature = executionValues.map(function (v) {
    return fns[v] ? strToHex(v) : grey(v);
  }).join(SPACE + grey(TO_SYMBOL) + SPACE);
  var executionSignatureLine = [
    emptyness,
    grey(EQUAL_SYMBOL),
    executionSignature
  ].join(SPACE);
  console.log(executionSignatureLine);

  console.log();
}

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

      log(displayName, methodSignature, executionSignature);
    }

    return returnValue;
  };
  w._fn = fn;
  w.displayName = displayName;
  w._wrapped = true;

  // This is internal and is commented out for now.
  // logNameAssignment(w.displayName, getFnName(fn));

  return w;
}

function rewrapFn(oldFnName, newFnName, fn, lookFn, lookInstance) {
  var isEnabled = lookInstance.enabled;
  if (isEnabled) {
    logNameAssignment(newFnName, oldFnName);
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

  fns[fnName] = true;

  var isFnWrapped = !!fn._wrapped;
  var _lookInstance = this;
  var _lookFn = _lookInstance.look.bind(_lookInstance);
  var wrapFn = isFnWrapped ? rewrapFn(fn.displayName, fnName, fn._fn, _lookFn, _lookInstance) : getWrappedFn(fnName, fn, _lookFn, _lookInstance);

  return wrapFn;
};

module.exports = Look;
