var R = require('ramda');
var inspect = require('util-inspect');

var hex = require('text-hex');
var crayon = require('@ccheever/crayon');

var fns = {};
var anonymousFnCounter = 0;

var OF_TYPE_SYMBOL = '∷';
var TO_SYMBOL = '→';
var LAMBDA_SYMBOL = 'λ';
var EQUAL_SYMBOL = '=';

var SPACE = ' ';

var isArray = R.is(Array);
var isFunction = R.is(Function);

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

function Look () {
  this.enabled = true;
}

Look.prototype.on = function on() {
  this.enabled = true;
};

Look.prototype.off = function off() {
  this.enabled = false;
};

/**
 * Wraps the function that you want to be observed.
 *
 * Can be called with `look(fn)` or `look('functionName', fn)`.
 */
Look.prototype.look = function look(fnName, fn) {
  var isEnabled = this.enabled;
  if (!isEnabled) {
    return fn;
  }

  if (isFunction(fnName)) {
    fn = fnName;
    fnName = getFnName(fn);
  }

  fns[fnName] = true;

  var isFnWrapped = !!fn.wrapped;

  function getWrappedFn(displayName, fn, lookFn) {
    var w = function wrap(/* arguments */) {
      var returnValue = fn.apply(fn, arguments);

      if (isEnabled) {
        var argsList = R.values(arguments);

        if (isFunction(returnValue)) {
          var newFnName = displayName;
          if (argsList.length) {
            var oldArgsList = fn.argsList || [];
            var fnArgsList = oldArgsList.concat(argsList);
            newFnName = R.head(newFnName.split('(')).trim();
            newFnName = newFnName + '(' + serializeValues(fnArgsList).join(', ') + ')';
          }
          // returnValue.displayName = newFnName;
          returnValue.argsList = fnArgsList;
          returnValue = lookFn(newFnName, returnValue);
        }

        var methodSignature = generateMethodTypes(argsList, returnValue);
        var executionSignature = generateExecutionValues(argsList, returnValue);

        log(displayName, methodSignature, executionSignature);
      }

      return returnValue;
    };
    w.fn = fn;
    w.displayName = fnName;
    w.wrapped = true;

    return w;
  }

  var lookFn = this.look.bind(this);
  var wrapFn = isFnWrapped ? getWrappedFn(fnName, fn.fn, lookFn) : getWrappedFn(fnName, fn, lookFn);

  return wrapFn;
};

function nameFunctions(library, lookFn) {
  if (!library) {
    throw new Error('A library must be passed into ramda-debug#wrap.')
  }

  return R.mapObjIndexed(function (v, k, o) {
    if (isFunction(v)) {
      v = lookFn(k, v);
    }
    return v;
  }, library);
}

var lookInstance = new Look();

var lookFn = lookInstance.look.bind(lookInstance);
lookFn.look = lookFn;
lookFn.on = lookInstance.on.bind(lookInstance);
lookFn.off = lookInstance.off.bind(lookInstance);
lookFn.wrap = R.partialRight(nameFunctions, lookFn);

module.exports = lookFn;
