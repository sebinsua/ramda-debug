#!/usr/bin/env node
'use strict';

var debug = require('debug')('a:namespace');

var R = require('ramda');
var look = require('..')(debug);

R = look.wrap(R);

var getResult = look.fov(function getResult(a, b, c, d) {
  var curry4 = R.curryN(4);
  var curriedAbc = curry4(function abc(_a, _b, _c, _d) {
    return _a + _b + _c + _d;
  });
  var curriedFn = look('curriedAbc', curriedAbc);

  var fn1 = curriedFn(a);
  var fn2 = fn1(b);
  var fn3 = fn2(c);
  var number = fn3(d);

  return number;
});

getResult(1, 2, 3, 4);
