import {expect} from "./helpers.mjs";

describe("Collections", () => {
	const A = {
		colour: 0x00FF00,
		width: 28.52,
		height: 10.2,
		range: [-20, 12],
	};
	const B = {
		name: "John",
		age: "Older than I look",
		occupation: "Larrikin",
		country: "Australia",
		city: "Melbourne",
	};
	
	describe("Maps", () => {
		it("prints string-type entries", () => {
			expect(new Map([
				["alpha", "A"],
				["beta",  "B"],
				["gamma", "G"],
				["delta", "D"],
			])).to.print(`Map {
				0.key => "alpha"
				0.value => "A"
				
				1.key => "beta"
				1.value => "B"
				
				2.key => "gamma"
				2.value => "G"
				
				3.key => "delta"
				3.value => "D"
			}`);
		});
		
		it("prints symbol-type entries", () => {
			const a = Symbol("Alpha");
			expect(new Map([["A", a]])).to.print(`Map {
				0.key => "A"
				0.value => Symbol(Alpha)
			}`);
			expect(new Map([[a, null]])).to.print(`Map {
				0.key => Symbol(Alpha)
				0.value => null
			}`);
			expect(new Map([[a, "A"]])).to.print(`Map {
				0.key => Symbol(Alpha)
				0.value => "A"
			}`);
			expect(new Map([[null, a]])).to.print(`Map {
				0.key => null
				0.value => Symbol(Alpha)
			}`);
			expect(new Map([[Symbol.iterator, a]])).to.print(`Map {
				0.key => @@iterator
				0.value => Symbol(Alpha)
			}`);
			expect(new Map([[a, Symbol.iterator]])).to.print(`Map {
				0.key => Symbol(Alpha)
				0.value => @@iterator
			}`);
		});
		
		it("prints object-type keys", () => {
			expect(new Map([
				[{a: "a", A: "A"}, "alpha"],
				[{b: "b", B: "B"}, "beta"],
				[{g: "g", G: "G"}, "gamma"],
				[{d: "d", D: "D"}, "delta"],
			])).to.print(`Map {
				0.key => {
					a: "a"
					A: "A"
				}
				0.value => "alpha"
				
				1.key => {
					b: "b"
					B: "B"
				}
				1.value => "beta"
				
				2.key => {
					g: "g"
					G: "G"
				}
				2.value => "gamma"
				
				3.key => {
					d: "d"
					D: "D"
				}
				3.value => "delta"
			}`);
			expect(new Map([
				[A, "A"],
				[B, "B"],
			])).to.print(`Map {
				0.key => {
					colour: 65280
					width: 28.52
					height: 10.2
					range: [
						-20
						12
					]
				}
				0.value => "A"
				
				1.key => {
					name: "John"
					age: "Older than I look"
					occupation: "Larrikin"
					country: "Australia"
					city: "Melbourne"
				}
				1.value => "B"
			}`);
			expect(new Map([ [{A, B}, "AB"] ])).to.print(`Map {
				0.key => {
					A: {
						colour: 65280
						width: 28.52
						height: 10.2
						range: [
							-20
							12
						]
					}
					B: {
						name: "John"
						age: "Older than I look"
						occupation: "Larrikin"
						country: "Australia"
						city: "Melbourne"
					}
				}
				0.value => "AB"
			}`);
		});
		
		it("prints object-type values", () => {
			expect(new Map([
				["alpha", {a: "a", A: "A"}],
				["beta",  {b: "b", B: "B"}],
				["gamma", {g: "g", G: "G"}],
				["delta", {d: "d", D: "D"}],
			])).to.print(`Map {
				0.key => "alpha"
				0.value => {
					a: "a"
					A: "A"
				}
				
				1.key => "beta"
				1.value => {
					b: "b"
					B: "B"
				}
				
				2.key => "gamma"
				2.value => {
					g: "g"
					G: "G"
				}
				
				3.key => "delta"
				3.value => {
					d: "d"
					D: "D"
				}
			}`);
			expect(new Map([
				["alphabeta", {
					alpha: {a: "a", A: "A"},
					beta:  {b: "b", B: "B"},
				}],
			])).to.print(`Map {
				0.key => "alphabeta"
				0.value => {
					alpha: {
						a: "a"
						A: "A"
					}
					beta: {
						b: "b"
						B: "B"
					}
				}
			}`);
		});
		
		it("prints properties", () => {
			const map = new Map([
				["A", "a"],
				["B", "b"],
				["C", "c"],
			]);
			map.name = "Quxabaz";
			map.customProperty = {
				foo: "Bar",
				baz: "Quux",
			};
			expect(map).to.print(`Map {
				0.key => "A"
				0.value => "a"
				
				1.key => "B"
				1.value => "b"
				
				2.key => "C"
				2.value => "c"
				
				name: "Quxabaz"
				customProperty: {
					foo: "Bar"
					baz: "Quux"
				}
			}`);
		});
		
		it("indicates references using `->`", () => {
			const list = [1];
			const mappedKey = new Map([[list, "list"]]);
			const mappedValue = new Map([["list", list]]);
			expect([list, mappedKey]).to.print(`input: [
				[
					1
				]
				Map {
					0.key -> input[0]
					0.value => "list"
				}
			]`, "input");
			expect([list, mappedValue]).to.print(`input: [
				[
					1
				]
				Map {
					0.key => "list"
					0.value -> input[0]
				}
			]`, "input");
			list.pop();
			expect([list, mappedKey, mappedValue]).to.print(`[
				[]
				Map {
					0.key -> {root}[0]
					0.value => "list"
				}
				Map {
					0.key => "list"
					0.value -> {root}[0]
				}
			]`);
		});
		
		it("prints empty maps on one line", () => {
			const map = new Map();
			expect(map).to.print("Map {}");
			map.foo = "Bar";
			expect(map).to.print(`Map {
				foo: "Bar"
			}`);
		});
	});
	
	describe("Sets", () => {
		it("prints basic entries", () => {
			const set = new Set(["A", "B", 0xCC]);
			expect(set).to.print(`Set {
				0 => "A"
				1 => "B"
				2 => 204
			}`);
		});
		
		it("prints symbol-type entries", () => {
			const set = new Set([Symbol.iterator, Symbol("Foo")]);
			expect(set).to.print(`Set {
				0 => @@iterator
				1 => Symbol(Foo)
			}`);
		});
		
		it("prints object-type entries", () => {
			const set = new Set(["0", A, B, "C"]);
			expect(set).to.print(`Set {
				0 => "0"
				1 => {
					colour: 65280
					width: 28.52
					height: 10.2
					range: [
						-20
						12
					]
				}
				2 => {
					name: "John"
					age: "Older than I look"
					occupation: "Larrikin"
					country: "Australia"
					city: "Melbourne"
				}
				3 => "C"
			}`);
		});
		
		it("prints nested sets", () => {
			const nest = new Set([1, A, "3", new Set([2, B, "4"])]);
			expect(nest).to.print(`Set {
				0 => 1
				1 => {
					colour: 65280
					width: 28.52
					height: 10.2
					range: [
						-20
						12
					]
				}
				2 => "3"
				3 => Set {
					0 => 2
					1 => {
						name: "John"
						age: "Older than I look"
						occupation: "Larrikin"
						country: "Australia"
						city: "Melbourne"
					}
					2 => "4"
				}
			}`);
		});
		
		it("prints properties", () => {
			const input = new Set(["A", "B", "C"]);
			input.name = "Quxabaz";
			input.customProperty = {
				foo: "Bar",
				baz: "Quux",
			};
			expect(input).to.print(`Set {
				0 => "A"
				1 => "B"
				2 => "C"
				
				name: "Quxabaz"
				customProperty: {
					foo: "Bar"
					baz: "Quux"
				}
			}`);
		});
		
		it("indicates references using `->`", () => {
			const bar = {name: "Bar"};
			const input = {foo: "Foo", bar, baz: new Set([bar])};
			expect(input).to.print(`{
				foo: "Foo"
				bar: {
					name: "Bar"
				}
				baz: Set {
					0 -> {root}.bar
				}
			}`);
		});
		
		it("prints empty sets on one line", () => {
			const set = new Set();
			expect(set).to.print("Set {}");
			set.foo = "Bar";
			expect(set).to.print(`Set {
				foo: "Bar"
			}`);
		});
	});
	
	describe("WeakMaps", () => {
		it("prints properties", () => {
			const input = new WeakMap();
			input.a = "ABC";
			expect(input).to.print(`WeakMap {
				a: "ABC"
			}`);
			input.b = "XYZ";
			expect(input).to.print(`WeakMap {
				a: "ABC"
				b: "XYZ"
			}`);
		});
		
		it("prints empty maps on one line", () => {
			expect(new WeakMap()).to.print("WeakMap {}");
		});
	});
	
	describe("WeakSets", () => {
		it("prints properties", () => {
			const input = new WeakSet();
			input.a = "ABC";
			expect(input).to.print(`WeakSet {
				a: "ABC"
			}`);
			input.b = "XYZ";
			expect(input).to.print(`WeakSet {
				a: "ABC"
				b: "XYZ"
			}`);
		});
		
		it("prints empty sets on one line", () => {
			expect(new WeakSet()).to.print("WeakSet {}");
		});
	});
});
