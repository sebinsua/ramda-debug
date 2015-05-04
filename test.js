#!/usr/bin/env node

var R = require('ramda');

var look = require('.');

// TODO: Move this within. Make it return and not modify the
//       object that was passed in.
function nameFunctions(obj) {
  return R.mapObjIndexed(function (v, k, o) {
    if (R.is(Function, v)) {
      v.displayName = k;
    }
    return v;
  }, obj)
}

nameFunctions(R);

var getName = look(R.prop)('name');

var obj = {
  'name': 'Seb'
};

// look.off();
// console.log(look);
var fnComposition = look(getName);

// TODO: Can I switch behaviour on and off?

// TODO: Can we color the output?

// TODO: Look at what treis has done and do it better.

// TODO: Is it possible to autobind .look() to the end
//       of all ramda functions?
//       Or make it all automatic.

// TODO: Can we handle multiple executions on one function?
//       What happens? At what point will the data be collected
//       or printed?

fnComposition(obj);

look(function () {

})();
