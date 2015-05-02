var R = require('ramda');

var SEPARATOR = '→';

function log(methodSignature, executionSignature) {
  console.log(methodSignature);
  console.log(executionSignature);
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
  var serialize = R.map(JSON.stringify);
  var values = serialize(argsList.concat(returnValue));

  var executionSignature = values.join(' ' + SEPARATOR + ' ');

  return executionSignature;
}

function look(fn) {
  return function wrap(/* arguments */) {
    var returnValue = fn.apply(fn, arguments);
    if (true/* || this.enabled */) {
      var argsList = R.values(arguments);

      var methodSignature = generateMethodSignature(argsList, returnValue);
      var executionSignature = generateExecutionSignature(argsList, returnValue);

      log(methodSignature, executionSignature);
    }

    return returnValue;
  };
}

function Look () {
  this.enabled = true;
}

Look.prototype.on = function on () {
  this.enabled = true;
};

Look.prototype.off = function off () {
  this.enabled = false;
};

module.exports = look;
