#!/usr/bin/env node

var R = require('ramda');
var look = require('.');

R = look.wrap(R);

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

var someResult = look.fov(function () {

  var curriedFn = look('curriedAbc', curriedAbc);

  var fn1 = curriedFn(1);
  var fn2 = fn1(2);
  var fn3  = fn2(3);
  var number = fn3(4);

  return number;
});

console.log(someResult);

var inner = look('inner', function () {});
var outer = look('outer', inner);
var universe = look('universe', outer);
inner();
outer();
universe();

// TODO: Separate logging from execution through use of emit/flush.
// TODO: Avoid printing out multiple executions. By default print a sample: [0, 1, 2, ... N-1, N].
// TODO: Make the execution signature concise for large arrays/objects.
// ----
// TODO: Make it easy to choose which functions are logged and in what order.
