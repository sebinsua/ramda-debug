#!/usr/bin/env node

var R = require('ramda');

var look = require('.');

var getName = look(R.prop)('name');

var obj = {
  'name': 'Seb'
};

var fnComposition = look(getName);

// TODO: Is it possible to autobind .look() to the end
//       of ramda functions?
// TODO: Can we handle multiple executions on one function?
//       What happens? At what point will the data be collected
//       or printed?
// TODO: What is the arity of the function?
// TODO: Can I get out the function name? How do debuggers do this?
// TODO: Can I wrap all R functions and unwrap them all after?
// TODO: Can I switch behaviour on and off?
// TODO: Is debug a better name than look?
// TODO: Can we color the output?

fnComposition(obj);
