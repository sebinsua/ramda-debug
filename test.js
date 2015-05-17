#!/usr/bin/env node

var R = require('ramda');
var look = require('.');

R = look.wrap(R);

var getNames = look.fov(function getNames(fruits) {
  var getType = R.prop('type');
  var mapNames = R.map(getType);

  return mapNames(fruits);
});

getNames([ { 'type': 'fruit' } ]);

/*
var getResult = look.fov(function getResult(a, b, c, d) {
  var curry4 = R.curryN(4);
  var curriedAbc = curry4(function abc(a, b, c, d) {
    return a + b + c + d;
  });
  var curriedFn = look('curriedAbc', curriedAbc);

  var fn1 = curriedFn(a);
  var fn2 = fn1(b);
  var fn3  = fn2(c);
  var number = fn3(d);

  return number;
});

getResult(1, 2, 3, 4);

var inner = look('inner', function () {});
var outer = look('outer', inner);
var universe = look('universe', outer);
inner();
outer();
universe();
*/
