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
This function takes 2 objects and tries to unify/recursively unify every common property of the objects.

```javascript
const { unify, Var, failed, _ } = require("unifyer");

const sbs1 = unify(10, 10);
console.log(sbs1); // -> {} empty object if unification is successful

const sbs2 = unify(10, 20);
console.log(sbs2 === failed); // -> true 

const sbs3 = unify([10, Var("x")],[Var("y"), 20]);
console.log(sbs3); // -> { x: 20, y:10 } 

const sb4 = unify({ a: _ , b: 33 ), { a: 11 });
console.log(sbs4); // -> { a: 11 } 
```
