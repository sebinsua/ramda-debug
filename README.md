# ramda-debug
:ram: Debugging for Ramda.

```javascript
var R    = require('ramda'),
    look = require('ramda-debug');

var getName = look(R.prop)('name');

var name = getName({
  name: 'Andy'
});
```
