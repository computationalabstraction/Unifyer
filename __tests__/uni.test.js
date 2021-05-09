const { unify, unify_all, failed, Var } = require("../src/uni");

test('unify', () => {
    expect(unify(["g",Var("x2")],Var("x1"))).toEqual({
        x1: ["g", Var("x2")]
    });
    expect(unify(["f",Var("x1"),["h",Var("x1")],Var("x2")],["f",["g",Var("x3")],Var("x4"),Var("x3")])).toEqual({
        x1: ["g", Var("x3")],
        x4: ["h", Var("x1")],
        x2: Var("x3"),
    });
    expect(unify(Var("x"),["f",Var("x")])).toEqual(failed);
    expect(unify({x:10, y:20},{i:100, j:200})).toEqual({});
    expect(unify(10,20)).toEqual(failed);
    expect(unify(10,{x:10, y:20})).toEqual(failed);
});

test("unify_all", () => {
    expect(unify_all([
        [Var("x"),Var("x")],
        [Var("x"),Var("y")],
    ])).toEqual(failed);
    expect(unify_all([
        [Var("x"),Var("y")],
        [Var("y"),Var("z")],
        [Var("z"),10],
    ])).toEqual({ x: 10, y: 10, z:10 });
});