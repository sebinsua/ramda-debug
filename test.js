#!/usr/bin/env node

var R = require('ramda');

var look = require('.');

function nameFunctions(obj) {
  return R.mapObjIndexed(function (v, k, o) {
    if (R.is(Function, v)) {
      v.displayName = k;
    }
    return v;
  }, obj)
}

nameFunctions(R);

/*
function thing() {
  throw new Error('Damn.');
}

thing.displayName = 'nope';

console.log(thing);
thing();
*/

// console.log(R.prop.displayName);

var getName = look(R.prop)('name');

var obj = {
  'name': 'Seb'
};

// look.off();
// console.log(look);
var fnComposition = look(getName);

// TODO: Loop through each of the Ramda functions naming them
//       with their key.
//       Depending on debug level, either use .name or .displayName.

// TODO: lambda symbol, colon colon symbol.

// TODO: Get out a hash of the function reference.

// TODO: Can we find this anywhere?
//       R.uncurry(f) == fn

// TODO: Look at what treis has done and do it better.

// TODO: Is it posdsible to autobind .look() to the end
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
