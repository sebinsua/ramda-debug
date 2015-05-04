var R = require('ramda');

var anonymousFnCounter = 0;

var OF_TYPE_SYMBOL = '∷';
var TO_SYMBOL = '→';
var LAMBDA_SYMBOL = 'λ';
var EQUAL_SYMBOL = '=';

var SPACE = ' ';

var isArray = R.is(Array);
var isFunction = R.is(Function);

function log(fnName, methodSignature, executionSignature) {
  var methodSignatureLine = [
    fnName,
    OF_TYPE_SYMBOL,
    methodSignature
  ].join(SPACE);
  console.log(methodSignatureLine);

  var emptyness = new Array(fnName.length + 1).join(SPACE);
  var executionSignatureLine = [
    emptyness,
    EQUAL_SYMBOL,
    executionSignature
  ].join(SPACE);
  console.log(executionSignatureLine);

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

function serializeValue(v) {
  if (R.is(Function, v)) {
    return getFnName(v);
  }
  return JSON.stringify(v);
}

var serializeValues = R.map(serializeValue);

function generateMethodSignature(argsList, returnValue) {
  var argumentTypes = getTypes(argsList);

  var returnType = getType(returnValue);
  var types = argumentTypes.concat(returnType);

  var methodSignature = types.join(SPACE + TO_SYMBOL + SPACE);

  return methodSignature;
}

function generateExecutionSignature(argsList, returnValue) {
  var values = serializeValues(argsList.concat(returnValue));

  var executionSignature = values.join(SPACE + TO_SYMBOL + SPACE);

  return executionSignature;
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

Look.prototype.look = function look(fn) {
  var wrapFn = function wrap(/* arguments */) {
    var returnValue = fn.apply(fn, arguments);

    // console.log('hi');
    if (this.enabled) {
      // console.log('never runs');
      var argsList = R.values(arguments);
      // console.log(argsList);
      var fnName = getFnName(fn);
      if (isFunction(returnValue)) {
        // TODO: Make this expand slowly using previous argsList.
        var newFnName = fnName;
        if (argsList.length) {
          newFnName = newFnName + '(' + serializeValues(argsList).join(', ') + ')';
        }
        returnValue.displayName = newFnName;
        returnValue = this.look(returnValue);
      }

      var methodSignature = generateMethodSignature(argsList, returnValue);
      var executionSignature = generateExecutionSignature(argsList, returnValue);

      log(fnName, methodSignature, executionSignature);
    }

    return returnValue;
  }.bind(this);
  wrapFn.displayName = getFnName(fn);

  return wrapFn;
};

// TODO: Stop it from modifying the object that was passed in.
function nameFunctions(obj, lookInstance) {
  return R.mapObjIndexed(function (v, k, o) {
    if (isFunction(v)) {
      v.displayName = k;
      v = lookInstance.look(v);
    }
    return v;
  }, obj);
}

module.exports = function init(library) {
  if (!library) {
    throw new Error('A library must be passed into ramda-debug for it to work.')
  }
  if (library && library.look) {
    throw new Error('The library already has a look() bound to it.');
  }

  var lookInstance = new Look();

  var lookFn = lookInstance.look.bind(lookInstance);
  lookFn.on = lookInstance.on.bind(lookInstance);
  lookFn.off = lookInstance.off.bind(lookInstance);

  var newLibrary = nameFunctions(library, lookInstance);
  newLibrary.look = lookFn;

  return newLibrary;
};
