# ramda-debug
:ram: Debugging for Ramda.

```
var R    = require('ramda'),
    look = require('ramda-look');

var getName = look(R.prop)('name');

var name = getName({
  name: 'Andy'
});
```
