#!/usr/bin/env node
'use strict';

var debug = require('debug')('a:namespace');

var look = require('..')(debug).on();

var inner = look('inner', function () {});
var outer = look('outer', inner);
var universe = look('universe', outer);
inner();
outer();
universe();
