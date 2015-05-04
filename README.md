# ramda-debug
:ram: Debugging for Ramda.

```javascript
var R = require('ramda');
var look = require('ramda-debug');

R = look(R);

var getType = R.prop('type');
var mapNames = R.map(getType);

var entities = [
  {
    'type': 'fruit'
  },
  {
    'type': 'fruit'
  },
  {
    'type': 'vegetable'
  }
];

mapNames(entities);
```
