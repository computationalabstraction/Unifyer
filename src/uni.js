const { tagged } = require("styp");

const Var = tagged("Var",["name"]);

const _ = Var(Date.now().toString());

function atomic(value) {
    console.log("atomic");
    console.log(value);
    return Object(value) !== value || !Array.isArray(value);
}

function compound(v) {
    return !atomic(v) && !Var.is(v);
}

const failed = Symbol("Failed");
const rest = Symbol("*");

function occurs(v,e,subst) {
    if(atomic(e)) return false;
    if(Var.is(e) && v.name === e.name) return true;
    if(Var.is(e) && e.name in subst) return occurs(v,subst[e.name],subst);
    if(compound(e)) {
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
    // console.log("here!")
    subst[f1.name] = f2;
    return subst;
}

function unify(f1,f2,subst={}) {
    // console.log("outer-----");
    // console.log(f1);
    // console.log(f2);
    // console.log(subst);
    // console.log("----------");
    if(subst === failed) return failed;
    if(f1 === rest || f2 === rest) return subst;
    if(atomic(f1) && atomic(f2)) return f1 === f2?subst:failed;
    // console.log("near variables");
    if(Var.is(f1)) return unifyvar(f1,f2,subst);
    if(Var.is(f2)) return unifyvar(f2,f1,subst);
    if(compound(f1) && compound(f2)) {
        const k1 = Object.keys(f1);
        const k2 = Object.keys(f2);
        const common = Array.from(new Set(Array.from([...k1,...k2]).filter(k => k1.includes(k) && k2.includes(k))));
        console.log(common);
        if(Array.isArray(f1) && Array.isArray(f2) && f1.length !== f2.length) {
            // Add a kind of - rest of ... operator
            // let arr;
            let index = f1.length < f2.length?
                (arr = f1) && f1.indexOf(rest):
                (arr = f2) && f2.indexOf(rest);
            // console.log("index");
            // console.log(index);
            if(index == -1) return failed;
            // console.log("locating the array");
            // console.log(arr);
            // return failed;
        }
        const final = common.reduce((prev,key) => {
            console.log("inside final");
            console.log(f1[key])
            console.log(f2[key])
            return unify(f1[key]===_?Var(key):f1[key],f2[key]===_?Var(key):f2[key],prev);
        }, Object.assign({}, subst));  
        return final;
        // return final === failed? failed: Object.keys(final).length === 0 && common.length > 0? failed: final;
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

// console.log(unify([ 'job', [ 'Fect', 'Cy', 'D' ], [ 'computer'] ],[ 'job', [ 'Fect', rest], Var("x") ]))