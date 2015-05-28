'use strict';

var hex = require('text-hex');
var crayon = require('@ccheever/crayon');

var OF_TYPE_SYMBOL = '∷';
var TO_SYMBOL = '→';
var EQUAL_SYMBOL = '=';

var SPACE = ' ';

var grey = function grey(str) {
  return crayon('#aaa')(str);
};

function colorWrappedFnName(fnName, wrappedFnNames) {
  wrappedFnNames = wrappedFnNames || {};

  var strToHex = function strToHex(str) {
    return crayon(hex(str))(str);
  };

  return wrappedFnNames[fnName] ? strToHex(fnName) : grey(fnName);
}

function formatNameAssignment(newFnName, oldFnName, wrappedFnNames) {
  var fnAssignmentSignature = [newFnName, oldFnName].map(function (v) {
    return colorWrappedFnName(v, wrappedFnNames);
  }).join(SPACE + grey(EQUAL_SYMBOL) + SPACE);

  return fnAssignmentSignature;
}

function formatSignature(fnName, methodTypes, executionValues, wrappedFnNames) {
  var methodSignature = methodTypes.join(SPACE + TO_SYMBOL + SPACE);
  var methodSignatureLine = [
    colorWrappedFnName(fnName, wrappedFnNames),
    OF_TYPE_SYMBOL,
    methodSignature
  ].join(SPACE);

  var emptyness = new Array(fnName.length + 1).join(SPACE);
  var executionSignature = executionValues.map(function (v) {
    return colorWrappedFnName(v, wrappedFnNames);
  }).join(SPACE + grey(TO_SYMBOL) + SPACE);
  var executionSignatureLine = [
    emptyness,
    grey(EQUAL_SYMBOL),
    executionSignature
  ].join(SPACE);

  return [
    methodSignatureLine,
    executionSignatureLine
  ];
}

module.exports.formatNameAssignment = formatNameAssignment;
module.exports.formatSignature = formatSignature;
