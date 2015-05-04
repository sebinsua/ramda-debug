# ramda-debug
> :ram: Debugging for Ramda.

![Example](http://i.imgur.com/lEL9Lh9.png)

```javascript
var R = require('ramda');

R = require('ramda-debug')(R);

var getType = R.prop('type');
var mapNames = R.map(getType);

mapNames([ { 'type': 'fruit' } ]);
```


