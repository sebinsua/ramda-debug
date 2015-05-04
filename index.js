var R = require('ramda');

var anonymousFnCounter = 0;

var OF_TYPE_SYMBOL = '∷';
var TO_SYMBOL = '→';
var LAMBDA_SYMBOL = 'λ';
var EQUAL_SYMBOL = '=';

var isArray = R.is(Array);
var isFunction = R.is(Function);

function log(fn, methodSignature, executionSignature) {
  var fnName = getFnName(fn);
  console.log(fnName + ' ' + OF_TYPE_SYMBOL + ' ' + methodSignature);

  var emptyness = new Array(fnName.length + 1).join(' ');
  console.log(emptyness + ' ' + EQUAL_SYMBOL + ' ' + executionSignature);

  console.log();
}

// TODO: Aim to call this less often.
function getFnName(fn) {
  var fnName = fn.displayName || fn.name;
  if (fnName) {
    return fnName;
  }
  // TODO: Currently I am counting up too often.
  return LAMBDA_SYMBOL + anonymousFnCounter++;
}

function getType(value) {
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

  var methodSignature = types.join(' ' + TO_SYMBOL + ' ');

  return methodSignature;
}

function generateExecutionSignature(argsList, returnValue) {
  // TODO: Clean this up.
  var serialize = R.map(function (v) {
    if (R.is(Function, v)) {
      return getFnName(v);
    }
    return JSON.stringify(v);
  });
  var values = serialize(argsList.concat(returnValue));

  var executionSignature = values.join(' ' + TO_SYMBOL + ' ');

  return executionSignature;
}

module.exports = function init() {

  function Look () {
    this.enabled = true;
  }

  Look.prototype.on = function on() {
    this.enabled = true;
  };

  Look.prototype.off = function off() {
    this.enabled = false;
  };

  Look.prototype.look = function look(fn) {
    var wrapFn = function wrap(/* arguments */) {
      var returnValue = fn.apply(fn, arguments);

      if (this.enabled) {
        var argsList = R.values(arguments);

        if (isFunction(returnValue)) {
          // TODO: Make this expand slowly.
          returnValue.displayName = getFnName(fn) + '(' + argsList.map(JSON.stringify).join(', ') + ')';
        }

        var methodSignature = generateMethodSignature(argsList, returnValue);
        var executionSignature = generateExecutionSignature(argsList, returnValue);

        log(fn, methodSignature, executionSignature);
      }

      return returnValue;
    }.bind(this);
    wrapFn.displayName = getFnName(fn);

    return wrapFn;
  };

  var lookInstance = new Look();
  var lookFn = lookInstance.look.bind(lookInstance);

  lookFn.on = lookInstance.on.bind(lookInstance);
  lookFn.off = lookInstance.off.bind(lookInstance);

  return lookFn;
};
