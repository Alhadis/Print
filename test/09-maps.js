"use strict";

const {expect} = require("chai");

const A = {
	colour: 0x00FF00,
	width: 28.52,
	height: 10.2,
	range: [-20, 12],
};

const B = {
	name: "Foo",
	type: "Bar",
	nickname: "Baz",
	cereal: "Quuz",
	age: 30,
};

describe("Maps", () => {
	it("lists basic values", () => {
		const map = new Map([
			["alpha", "A"],
			["beta",  "B"],
			["gamma", "G"],
			["delta", "D"],
		]);
		expect(map).to.print(`Map{
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
	
	it("lists object values", () => {
		const map = new Map([
			["alpha", {a: "a", A: "A"}],
			["beta",  {b: "b", B: "B"}],
			["gamma", {g: "g", G: "G"}],
			["delta", {d: "d", D: "D"}],
		]);
		expect(map).to.print(`Map{
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
	});
	
	it("lists nested object values", () => {
		const map = new Map([
			["alphabeta", {
				alpha: {a: "a", A: "A"},
				beta:  {b: "b", B: "B"},
			}],
		]);
		expect(map).to.print(`Map{
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
	
	it("prints empty Maps on one line", () => {
		expect(new Map()).to.print("Map{}");
	});

	it("prints empty WeakMaps on one line", () => {
		expect(new WeakMap()).to.print("WeakMap{}");
	});
	
	it("prints object keys", () => {
		const map = new Map([
			[A, "A"],
			[B, "B"],
		]);
		expect(map).to.print(`Map{
			0.key => {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			0.value => "A"
			
			1.key => {
				age: 30
				cereal: "Quuz"
				name: "Foo"
				nickname: "Baz"
				type: "Bar"
			}
			1.value => "B"
		}`);
	});
	
	it("prints nested object keys", () => {
		expect(new Map([ [{A, B}, "AB"] ])).to.print(`Map{
			0.key => {
				A: {
					colour: 65280
					height: 10.2
					range: [
						-20
						12
					]
					width: 28.52
				}
				B: {
					age: 30
					cereal: "Quuz"
					name: "Foo"
					nickname: "Baz"
					type: "Bar"
				}
			}
			0.value => "AB"
		}`);
	});
	
	it("prints symbols", () => {
		const a = Symbol("Alpha");
		expect(new Map([[a, "A"]])).to.print(`Map{
			0.key => Symbol(Alpha)
			0.value => "A"
		}`);
		expect(new Map([[null, a]])).to.print(`Map{
			0.key => null
			0.value => Symbol(Alpha)
		}`);
	});
	
	it("prints named properties in Maps", () => {
		const input = new Map([
			["A", "a"],
			["B", "b"],
			["C", "c"],
		]);
		input.name = "Quxabaz";
		input.customProperty = {
			foo: "Bar",
			baz: "Quux",
		};
		
		expect(input).to.print(`Map{
			0.key => "A"
			0.value => "a"
			
			1.key => "B"
			1.value => "b"
			
			2.key => "C"
			2.value => "c"
			
			customProperty: {
				baz: "Quux"
				foo: "Bar"
			}
			name: "Quxabaz"
		}`);
	});
	
	it("prints named properties in WeakMaps", () => {
		const input = new WeakMap();
		input.A = A;
		input.B = B;
		expect(input).to.print(`WeakMap{
			A: {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			B: {
				age: 30
				cereal: "Quuz"
				name: "Foo"
				nickname: "Baz"
				type: "Bar"
			}
		}`);
	});
	
	it("only pads named properties in Maps with entries", () => {
		const input = new Map();
		input.name = "Quxabaz";
		expect(input).to.print(`Map{
			name: "Quxabaz"
		}`);
	});
});
