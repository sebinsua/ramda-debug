#!/usr/bin/env node

var R = require('ramda');

R = require('.')(R);

var getType = R.prop('type');
var mapNames = R.map(getType);

var entities = [{
  'type': 'fruit'
}, {
  'type': 'fruit'
}, {
  'type': 'vegetable'
}];
mapNames(entities);

// TODO: Separate logging from execution through use of emit/flush.
// TODO: Should not print out multiple executions.

// TODO: Make the execution signature more concise when large amounts of data are handled.
// TODO: Make it easy to choose which functions are logged and in what order.
