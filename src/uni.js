const { tagged } = require("styp");

const Var = tagged("Var",["name"]);

function atomic(value) {
    return Object(value) !== value
}

function iscompound(v) {
    return !atomic(v) && !Var.is(v);
}

const failed = Symbol("Failed");

function occurs(v,e,subst) {
    if(atomic(e)) return false;
    if(Var.is(e) && v.name === e.name) return true;
    if(Var.is(e) && e.name in subst) return occurs(v,subst[e.name],subst);
    if(iscompound(e)) {
        for(let ele of e) {
            if(occurs(v,ele,subst)) return true;
        }   
    }
    return false;
}

function unifyvar(f1,f2,subst) {
    if(f1.name in subst) return unify(subst[f1.name],f2,subst);
    if(Var.is(f2) && f2.name in subst) return unify(f1,subst[f2.name],subst);
    if(occurs(f1,f2,subst)) return failed;
    subst[f1.name] = f2;
    return subst;
}

function unify(f1,f2,subst={}) {
    if(subst === failed) return failed;
    if(atomic(f1) && atomic(f2)) return f1 === f2?subst:failed;
    if(Var.is(f1)) return unifyvar(f1,f2,subst);
    if(Var.is(f2)) return unifyvar(f2,f1,subst);
    if(Array.isArray(f1) && Array.isArray(f2)) {
        const k1 = Object.keys(f1).map(i => parseInt(i));
        const k2 = Object.keys(f2).map(i => parseInt(i));
        const common = Array.from(new Set(Array.from([...k1,...k2]).filter(k => k1.includes(k) && k2.includes(k))));
        return common.reduce((prev,key) => unify(f1[key],f2[key],prev),{});
    }
    if(typeof f1 === "object" && typeof f2 === "object") {
        const k1 = Object.keys(f1);
        const k2 = Object.keys(f2);
        const common = Array.from(new Set(Array.from([...k1,...k2]).filter(k => k1.includes(k) && k2.includes(k))));
        return common.reduce((prev,key) => unify(f1[key],f2[key],prev),{});  
    }
    return failed;
}

function unify_all(eqs) {
    return eqs.reduce((acc,v) => unify(v[0],v[1],acc),{});
}

const u1 = unify(["g",Var("x2")],Var("x1"));
const u2 = unify(["f",Var("x1"),["h",Var("x1")],Var("x2")],["f",["g",Var("x3")],Var("x4"),Var("x3")]);
console.log(u1);
console.log(u2);

// console.log(unify(variable("x"),["f",variable("x")]));