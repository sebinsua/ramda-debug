# ramda-debug [![npm version](https://badge.fury.io/js/ramda-debug.svg)](https://www.npmjs.com/package/ramda-debug)
> :ram: Debugging for Ramda.

Aims to ease observability when coding in a [point-free programming style](http://en.wikipedia.org/wiki/Tacit_programming) hopefully making it easier to spot errors.

```javascript
var R = require('ramda');
var look = require('ramda-debug');

R = look.wrap(R);

var getTypes = look.fov(function getTypes(fruits) {
  var getType = R.prop('type');
  var mapTypes = R.map(getType);

  return mapTypes(fruits);
});

getTypes([ { 'type': 'fruit' } ]);
```

![Example](http://i.imgur.com/5IVzjc3.png)
The type signatures emitted are type signatures constructed from runtime usage of a function. The intention is that if a function is being used incorrectly the type signature will also be incorrect and that this can be noticed. Unfortunately it means that polymorphism will not be apparent.

## Usage

By default debugging is *not* enabled.

#### `look(fn)`

A function can be passed in and a wrapped function that can emit debug information on execution will be returned.

Any function can be wrapped using this.

#### `wrap(library)`

An object of functions may be passed in and an object or wrapped functions will be returned.

Any object of functions can be wrapped using this and not just Ramda.

#### `fov(fn)`

This returns a function that provides a field of view within a function by proxying into `fn` and switching debugging on while it is being executed.

#### `enable(enabled)`

Switch debugging to this boolean value.

#### `on()`

Switch debugging on.

#### `off()`

Switch debugging off.

## Installation
```shell
npm install [--save] ramda-debug;
```
