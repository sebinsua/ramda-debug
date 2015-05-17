#!/usr/bin/env node
'use strict';

var R = require('ramda');
var look = require('..');

R = look.wrap(R);

var getTypes = look.fov(function getTypes(fruits) {
  var getType = R.prop('type');
  var mapTypes = R.map(getType);

  return mapTypes(fruits);
});

getTypes([ { 'type': 'fruit' } ]);
