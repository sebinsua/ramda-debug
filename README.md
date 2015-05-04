# ramda-debug
:ram: Debugging for Ramda.

```javascript
var R = require('ramda');
var look = require('ramda-debug');

R = look(R);

var getType = R.prop('type');
var mapNames = R.map(getType);

var entities = ;

mapNames([ { 'type': 'fruit' } ]);
```

![Example](http://i.imgur.com/VCUq0Va.png)
