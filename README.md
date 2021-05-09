# unifyer
Unifier for Javascript

## Documentation
> underconstruction

##### API
* `unify`
* `unify_all`
* `Var`
* `replace`
* `failed`


#### `unify(eq1: Object | Primitve, eq2: Object | Primitve, subst: Object = {}) -> Object | Symbol`
This function takes 2 objects and tries to unify/recursively unify every property of the object.

```javascript
const { unify, Var, failed } = require("unifyer");

const sbs1 = unify(10, 10);
console.log(sbs1); // -> {} empty object if unification is successful

const sbs2 = unify(10, 20);
console.log(sbs2); // -> failed 

const sbs3 = unify([10, Var("x")],[Var("y"), 20]);
console.log(sbs3); // -> { x: 20, y:10 } 
```
