#!/usr/bin/env node
'use strict';

var debug = require('debug')('a:namespace');

var R = require('ramda');
var look = require('..')(debug);

R = look.wrap(R);

var getTypes = look.fov(function getTypes(fruits) {
  var getType = R.prop('type');
  var mapTypes = R.map(getType);

  return mapTypes(fruits);
});

getTypes([ { 'type': 'fruit' } ]);
