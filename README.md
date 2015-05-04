# ramda-debug [![npm version](https://badge.fury.io/js/ramda-debug.svg)](https://www.npmjs.com/package/ramda-debug)
> :ram: Debugging for Ramda.

Aims to ease observability when coding in a [point-free programming style](http://en.wikipedia.org/wiki/Tacit_programming) with JavaScript hopefully making it easier to spot errors.

```javascript
var R = require('ramda');

R = require('ramda-debug')(R);

var getType = R.prop('type');
var mapNames = R.map(getType);

mapNames([ { 'type': 'fruit' } ]);
```

![Example](http://i.imgur.com/lEL9Lh9.png)

## Installation
```shell
npm install [--save] ramda-debug;
```
