"use strict";

const fs     = require("fs");
const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


Chai.untab = 2;

const A = {
	colour: 0x00FF00,
	width: 28.52,
	height: 10.2,
	range: [-20, 12]
};

const B = {
	name: "Foo",
	type: "Bar",
	nickname: "Baz",
	cereal: "Quuz",
	age: 30
};


describe("Maps", () => {
	
	it("Prints Maps with basic values", () => {
		const map = new Map([
			["alpha", "A"],
			["beta",  "B"],
			["gamma", "G"],
			["delta", "D"]
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
	
	
	it("Prints Maps with object values", () => {
		const map = new Map([
			["alpha", {a: "a", A: "A"}],
			["beta",  {b: "b", B: "B"}],
			["gamma", {g: "g", G: "G"}],
			["delta", {d: "d", D: "D"}]
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
	
	
	it("Prints Maps with nested object values", () => {
		const map = new Map([
			["alphabeta", {
				alpha: {a: "a", A: "A"},
				beta:  {b: "b", B: "B"}
			}]
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
	
	
	it("Prints Maps with object keys", () => {
		const map = new Map([
			[A, "A"],
			[B, "B"]
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
	
	
	it("Prints Maps with nested object keys", () => {
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
	
	
	it("Shows symbols in Maps", () => {
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
});



describe("Sets", () => {
	
	it("Prints Sets with basic values", () => {
		const set = new Set(["A", "B", 0xCC]);
		expect(set).to.print(`Set{
			0 => "A"
			1 => "B"
			2 => 204
		}`)
	});
	
	it("Prints Sets with objects", () => {
		const set = new Set(["0", A, B, "C"]);
		expect(set).to.print(`Set{
			0 => "0"
			1 => {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			2 => {
				age: 30
				cereal: "Quuz"
				name: "Foo"
				nickname: "Baz"
				type: "Bar"
			}
			3 => "C"
		}`)
	});
	
	
	it("Prints nested Sets", () => {
		const nest = new Set([1, A, "3", new Set([2, B, "4"])]);
		expect(nest).to.print(`Set{
			0 => 1
			1 => {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			2 => "3"
			3 => Set{
				0 => 2
				1 => {
					age: 30
					cereal: "Quuz"
					name: "Foo"
					nickname: "Baz"
					type: "Bar"
				}
				2 => "4"
			}
		}`);
	});
});
