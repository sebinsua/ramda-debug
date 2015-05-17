#!/usr/bin/env node
'use strict';

var look = require('..').on();

var inner = look('inner', function () {});
var outer = look('outer', inner);
var universe = look('universe', outer);
inner();
outer();
universe();
