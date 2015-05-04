var R = require('ramda');

var SEPARATOR = '→';

function log(fn, methodSignature, executionSignature) {
  console.log(fn.displayName + ' ∷ ' + methodSignature);
  console.log(fn.displayName + ' ∷ ' + executionSignature);
}

function getType(value) {
  var isArray = R.is(Array);
  var type;
  if (isArray(value)) {
    var first = R.head(value);
    var firstType = getType(first);
    var types = getTypes(value);
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

function generateMethodSignature(argsList, returnValue) {
  var argumentTypes = getTypes(argsList);

  var returnType = getType(returnValue);
  var types = argumentTypes.concat(returnType);

  var methodSignature = types.join(' ' + SEPARATOR + ' ');

  return methodSignature;
}

function generateExecutionSignature(argsList, returnValue) {
  // TODO what if args or return values are functions?
  var serialize = R.map(function (v) {
    if (R.is(Function, v)) {
      return v.displayName;
    }
    return JSON.stringify(v);
  });
  var values = serialize(argsList.concat(returnValue));

  var executionSignature = values.join(' ' + SEPARATOR + ' ');

  return executionSignature;
}

function look(fn) {
  var wrapFn = function wrap(/* arguments */) {
    var returnValue = fn.apply(fn, arguments);

    if (true/* || this.enabled */) {
      var argsList = R.values(arguments);

      var isFunction = R.is(Function);
      if (isFunction(returnValue)) {
        returnValue.displayName = fn.displayName + '(' + argsList.map(JSON.stringify).join(', ') + ')';
      }

      var methodSignature = generateMethodSignature(argsList, returnValue);
      var executionSignature = generateExecutionSignature(argsList, returnValue);

      log(fn, methodSignature, executionSignature);
    }

    return returnValue;
  }
  wrapFn.displayName = fn.displayName;

  return wrapFn;
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

module.exports = look;

function init() {
  var self = new Look();
  return look.bind(self);
};
