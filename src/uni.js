function atomic(value) {
    return Object(value) !== value
}

function variable(v) {
    return {name:v, type:"var"}
}

function isvariable(v) {
    return typeof v === "object" && v.type === "var";
}

function iscompound(v) {
    return !atomic(v) && v.type !== "var";
}

const failed = Symbol("Failed");

function occurs(v,e,subst) {
    if(atomic(e)) return false;
    if(isvariable(e) && v.name === e.name) return true;
    if(isvariable(e) && e.name in subst) return occurs(v,subst[e.name],subst);
    if(iscompound(e)) {
        for(let ele of e) {
            if(occurs(v,ele,subst)) return true;
        }   
    }
    return false;
}

function unifyvar(f1,f2,subst) {
    if(f1.name in subst) return unify(subst[f1.name],f2,subst);
    if(isvariable(f2) && f2.name in subst) return unify(f1,subst[f2.name],subst);
    if(occurs(f1,f2,subst)) return failed;
    subst[f1.name] = f2;
    return subst;
}

function unify(f1,f2,subst={}) {
    if(subst === failed) return failed;
    if(atomic(f1) && atomic(f2)) return f1 === f2?subst:failed;
    if(isvariable(f1)) return unifyvar(f1,f2,subst);
    if(isvariable(f2)) return unifyvar(f2,f1,subst);
    if(f1.length === f2.length) {
        let prev = {}
        for(let i = 0; i < f1.length;i++) {
            prev = unify(f1[i],f2[i],prev);
        }
        return prev;
    }
    return failed;
}

function unify_all(eqs) {
    return eqs.reduce((acc,v) => unify(v[0],v[1],acc),{});
}


let u = unify_all([
    [["g",variable("x2")],variable("x1")],
    [["f",variable("x1"),["h",variable("x1")],variable("x2")],["f",["g",variable("x3")],variable("x4"),variable("x3")]],
]);
console.log(u);

// console.log(unify(variable("x"),["f",variable("x")]));