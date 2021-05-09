const { tagged } = require("styp");

const Var = tagged("Var",["name"]);

const keydef = Date.now().toString(); 
const _ = Var(keydef);

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
    if(iscompound(f1) && iscompound(f2)) {
        const k1 = Object.keys(f1);
        const k2 = Object.keys(f2);
        const common = Array.from(new Set(Array.from([...k1,...k2]).filter(k => k1.includes(k) && k2.includes(k))));
        return common.reduce((prev,key) => unify(f1[key],f2[key],prev),{});  
    }
    return failed;
}

function replace_one(v,subst) {
    if(Var.is(subst[v.name]) && subst[v.name].name in subst) return replace_one(subst[v.name],subst);
    return subst[v.name];
}

function replace(subst) {
    Object.keys(subst).forEach(k => Var.is(subst[k])? subst[k] = replace_one(subst[k],subst):0)
    return subst;
}

function unify_all(eqs) {
    return replace(eqs.reduce((acc,v) => unify(v[0],v[1],acc),{}));
}

module.exports = {
    unify,
    unify_all,
    failed,
    replace,
    Var,
    _
};