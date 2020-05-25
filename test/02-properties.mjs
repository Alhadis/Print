import {expect} from "./helpers.mjs";
import print from "../print.mjs";

describe("Property fields", () => {
	it("prints string-valued properties", () => {
		expect({foo: "bar"}).to.print(`{
			foo: "bar"
		}`);
		expect({123: "baz"}).to.print(`{
			123: "baz"
		}`);
		expect({baz: 123.4}).to.print(`{
			baz: 123.4
		}`);
	});
	
	it("prints symbol-valued properties", () => {
		expect({[Symbol("foo")]: "bar"}).to.print(`{
			Symbol(foo): "bar"
		}`);
		expect({[Symbol.toStringTag]: "foo"}).to.print(`{
			@@toStringTag: "foo"
		}`);
		expect({[Symbol.toStringTag]: "foo"}).to.print(`{
			Symbol(Symbol.toStringTag): "foo"
		}`, {noAmp: true});
		expect({[Symbol.iterator]: Symbol.iterator}).to.print(`{
			@@iterator: @@iterator
		}`);
		expect({[Symbol.iterator]: Symbol.iterator}).to.print(`{
			Symbol(Symbol.iterator): Symbol(Symbol.iterator)
		}`, {noAmp: true});
	});
	
	it("prints nested properties", () => {
		expect({foo: {bar: "baz"}}).to.print(`{
			foo: {
				bar: "baz"
			}
		}`);
		expect({foo: {bar: {baz: "qux"}}}).to.print(`{
			foo: {
				bar: {
					baz: "qux"
				}
			}
		}`);
	});
	
	it("prints empty objects on one line", () => {
		expect({}).to.print("{}");
		expect({foo: {}}).to.print(`{
			foo: {}
		}`);
	});
	
	it("identifies null prototypes", () => {
		const obj = {__proto__: null};
		expect(obj).to.print(`{
			Null prototype
		}`);
		obj.foo = "Foo";
		expect(obj).to.print(`{
			Null prototype
			
			foo: "Foo"
		}`);
		obj.bar = "Bar";
		expect(obj).to.print(`{
			Null prototype
			
			foo: "Foo"
			bar: "Bar"
		}`);
	});
	
	describe("Ordering", () => {
		const Γ = Symbol("gamma");
		const Ζ = Symbol("zeta");
		const Β = Symbol("beta");
		const Τ = Symbol("tau");
		const Α = Symbol("alpha");
		
		describe("Default", () => {
			it("sorts names in creation order", () => {
				expect({
					G: "gamma",
					Z: "zeta",
					B: "beta",
					T: "tau",
					A: "alpha",
				}).to.print(`{
					G: "gamma"
					Z: "zeta"
					B: "beta"
					T: "tau"
					A: "alpha"
				}`);
				const obj = {foo: "Foo"};
				obj.bar = "Bar";
				expect(obj).to.print(`{
					foo: "Foo"
					bar: "Bar"
				}`);
				delete obj.foo;
				obj.xyz = "XYZ";
				obj.abc = "ABC";
				obj.foo = "Foo";
				expect(obj).to.print(`{
					bar: "Bar"
					xyz: "XYZ"
					abc: "ABC"
					foo: "Foo"
				}`);
			});
			
			it("sorts symbols in creation order", () => {
				expect({
					[Γ]: "G",
					[Ζ]: "Z",
					[Β]: "B",
					[Τ]: "T",
					[Α]: "A",
				}).to.print(`{
					Symbol(gamma): "G"
					Symbol(zeta): "Z"
					Symbol(beta): "B"
					Symbol(tau): "T"
					Symbol(alpha): "A"
				}`);
				const foo = Symbol("foo");
				const obj = {[foo]: "Foo"};
				obj[Symbol("bar")] = "Bar";
				expect(obj).to.print(`{
					Symbol(foo): "Foo"
					Symbol(bar): "Bar"
				}`);
				delete obj[foo];
				obj[Symbol("xyz")] = "XYZ";
				obj[Symbol("abc")] = "ABC";
				obj[foo] = "Foo";
				expect(obj).to.print(`{
					Symbol(bar): "Bar"
					Symbol(xyz): "XYZ"
					Symbol(abc): "ABC"
					Symbol(foo): "Foo"
				}`);
			});
		
			it("sorts names and symbols separately", () => {
				const foo = Symbol("foo");
				const bar = Symbol("bar");
				const qux = Symbol("qux");
				const obj = {
					xyz: "XYZ",
					[foo]: "Foo",
					abc: "ABC",
					[bar]: "Bar",
				};
				expect(obj).to.print(`{
					xyz: "XYZ"
					abc: "ABC"
					Symbol(foo): "Foo"
					Symbol(bar): "Bar"
				}`);
				obj.foo = "Foo";
				obj[qux] = "Qux";
				expect(obj).to.print(`{
					xyz: "XYZ"
					abc: "ABC"
					foo: "Foo"
					Symbol(foo): "Foo"
					Symbol(bar): "Bar"
					Symbol(qux): "Qux"
				}`);
				delete obj.xyz;
				obj.xyz = "XYZ";
				expect(obj).to.print(`{
					abc: "ABC"
					foo: "Foo"
					xyz: "XYZ"
					Symbol(foo): "Foo"
					Symbol(bar): "Bar"
					Symbol(qux): "Qux"
				}`);
			});
		});
		
		when("`sortProps` is enabled", () => {
			it("sorts names alphabetically", () => {
				const obj = {
					G: "gamma",
					D: "delta",
					A: "alpha",
					B: "beta",
					P: "pi",
					__FB: "FooBar",
				};
				expect(obj).to.print(`{
					__FB: "FooBar"
					A: "alpha"
					B: "beta"
					D: "delta"
					G: "gamma"
					P: "pi"
				}`, {sortProps: true});
				obj.Z = "zeta";
				obj.E = "epsilon";
				expect(obj).to.print(`{
					__FB: "FooBar"
					A: "alpha"
					B: "beta"
					D: "delta"
					E: "epsilon"
					G: "gamma"
					P: "pi"
					Z: "zeta"
				}`, {sortProps: true});
			});
			
			it("sorts symbols alphabetically", () => {
				const obj = {
					[Γ]: "G",
					[Β]: "B",
					[Τ]: "T",
				};
				expect(obj).to.print(`{
					Symbol(beta): "B"
					Symbol(gamma): "G"
					Symbol(tau): "T"
				}`, {sortProps: true});
				obj[Ζ] = "Z";
				obj[Α] = "A";
				expect(obj).to.print(`{
					Symbol(alpha): "A"
					Symbol(beta): "B"
					Symbol(gamma): "G"
					Symbol(tau): "T"
					Symbol(zeta): "Z"
				}`, {sortProps: true});
			});
			
			it("sorts symbols and names together", () => {
				const obj = {
					xyz: "XYZ",
					[Symbol("uvw")]: "UVW",
					abc: "ABC",
					[Symbol("def")]: "DEF",
				};
				expect(obj).to.print(`{
					abc: "ABC"
					Symbol(def): "DEF"
					Symbol(uvw): "UVW"
					xyz: "XYZ"
				}`, {sortProps: true});
			});
			
			it("sorts case-insensitively", () => {
				expect({
					D: 0,
					c: 3,
					a: 1,
					B: 2,
				}).to.print(`{
					a: 1
					B: 2
					c: 3
					D: 0
				}`, {sortProps: true});
				expect({
					[Symbol("D")]: 0,
					[Symbol("c")]: 3,
					[Symbol("a")]: 1,
					[Symbol("B")]: 2,
				}).to.print(`{
					Symbol(a): 1
					Symbol(B): 2
					Symbol(c): 3
					Symbol(D): 0
				}`, {sortProps: true});
			});
		});
	});
	
	describe("Visibility", () => {
		it("hides non-enumerable properties", () => {
			const obj = {
				c: "C",
				b: "B",
				a: "A",
			};
			Object.defineProperty(obj, "b", {enumerable: false});
			expect(obj).to.print(`{
				c: "C"
				a: "A"
			}`);
			expect(obj).to.print(`{
				a: "A"
				c: "C"
			}`, {sortProps: true});
		});
		
		it("shows them if `opts.all` is enabled", () => {
			const obj = Object.defineProperties({}, {
				abc: {enumerable: false, value: "ABC"},
				xyz: {enumerable: true,  value: "XYZ"},
			});
			expect(obj).to.print(`{
				xyz: "XYZ"
			}`);
			expect(obj).to.print(`{
				abc: "ABC"
				xyz: "XYZ"
			}`, {all: true});
		});
		
		it("never shows inherited properties", () => {
			const descriptors = {
				foo: {value: "Foo", writable: true, enumerable: true},
				bar: {value: "Bar", writable: true, enumerable: false},
			};
			class Thing{ method(){} }
			Object.defineProperties(Thing.prototype, descriptors);
			const value = new Thing();
			expect(value).to.print("Thing {}");
			expect(value).to.print("Thing {}", {all: true});
			Object.defineProperties(value, descriptors);
			expect(value).to.print(`Thing {
				foo: "Foo"
			}`);
			expect(value).to.print(`Thing {
				foo: "Foo"
				bar: "Bar"
			}`, {all: true});
		});
	});
	
	describe("Accessors", () => {
		it("doesn't invoke getter functions", () => {
			let called = false;
			const obj = {
				get bar(){
					called = true;
					return "Bar";
				},
			};
			print(obj);
			expect(called).to.be.false;
			expect(obj.bar).to.equal("Bar");
			expect(called).to.be.true;
		});
		
		it("invokes them if `followGetters` is enabled", () => {
			let callCount = 0;
			expect({
				foo: "Foo",
				get bar(){
					return ++callCount;
				},
				baz: "Baz",
			}).to.print(`{
				foo: "Foo"
				bar: 1
				baz: "Baz"
			}`, {followGetters: true});
			expect(callCount).to.equal(1);
		});
		
		it("invokes non-enumerable getters only if `all` is enabled", () => {
			let abc = 0;
			let xyz = 0;
			const obj = Object.defineProperties({}, {
				abc: {enumerable: false, get(){ return ++abc; }},
				xyz: {enumerable: true,  get(){ return ++xyz; }},
			});
			expect(obj).to.print(`{
				xyz: 1
			}`, {followGetters: true});
			expect(abc).to.equal(0);
			expect(xyz).to.equal(1);
			expect(obj).to.print(`{
				abc: 1
				xyz: 2
			}`, {followGetters: true, all: true});
			expect(abc).to.equal(1);
			expect(xyz).to.equal(2);
		});
		
		it("catches and prints any error that's thrown", () => {
			const obj = {
				abc: "ABC",
				get foo(){
					const error = new Error("Don't touch me");
					error.y = "tho";
					throw error;
				},
				xyz: "XYZ",
			};
			expect(obj).to.print(`{
				abc: "ABC"
				foo: Error {
					y: "tho"
				}
				xyz: "XYZ"
			}`, {followGetters: true});
		});
	});
});