#!/usr/bin/env node

var R = require('ramda');
var look = require('.');

R = look.wrap(R)

var getType = R.prop('type');
var mapNames = R.map(getType);

var entities = [{
  'type': 'fruit'
}];
mapNames(entities);

var curry4 = R.curryN(4);

var curriedAbc = curry4(function abc(a, b, c, d) {
  return a + b + c + d;
});

// look('curriedAbc', fn) causes breakages because it double wraps.
var curriedFn = look('curriedAbc', curriedAbc);

var fn1 = curriedFn(1);
var fn2 = fn1(2);
var fn3  = fn2(3);
var number = fn3(4);

// TODO: Fix the function names.
var inner = look('inner', function () {});
var outer = look('outer', inner);
var universe = look('universe', outer);
inner();
outer();
universe();

// TODO: Separate logging from execution through use of emit/flush.
// TODO: Should not print out multiple executions.

// TODO: Make the execution signature more concise when large amounts of data are handled.
// TODO: Make it easy to choose which functions are logged and in what order.
