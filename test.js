#!/usr/bin/env node

var R = require('ramda');

var R = require('.')(R);

R.look.off();
R.look.on();

var getName = R.prop('name');

var obj = {
  'name': 'Seb'
};

var fnComposition = R.map(getName);

fnComposition([obj]);

R.look(function () {

})();

// TODO: How well does the disabling code work?

// TODO: Can we color the output?

// TODO: Look at what treis has done and do it better.

// TODO: Can we handle multiple executions on one function?
//       What happens? At what point will the data be collected
//       or printed?
