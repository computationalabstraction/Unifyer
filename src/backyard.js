// if(Array.isArray(f1) && Array.isArray(f2)) {
//     const k1 = Object.keys(f1).map(i => parseInt(i));
//     const k2 = Object.keys(f2).map(i => parseInt(i));
//     const common = Array.from(new Set(Array.from([...k1,...k2]).filter(k => k1.includes(k) && k2.includes(k))));
//     return common.reduce((prev,key) => unify(f1[key],f2[key],prev),{});
// }
// typeof f1 === "object" && typeof f2 === "object"

// const u1 = unify(["g",Var("x2")],Var("x1"));
// const u2 = unify(["f",Var("x1"),["h",Var("x1")],Var("x2")],["f",["g",Var("x3")],Var("x4"),Var("x3")]);
// console.log(u1);
// console.log(u2);
// console.log(unify(Var("x"),["f",Var("x")]));
