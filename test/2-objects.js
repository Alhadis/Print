"use strict";

const fs     = require("fs");
const path   = require("path");
const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


describe("Basic objects", function(){
	Chai.unindent(2);
	
	it("Prints simple objects", () => {
		expect({
			word: "String",
			number: 1024 * 768,
			object: {},
			list: []
		}).to.print(`{
			list: []
			number: 786432
			object: {}
			word: "String"
		}`);
	});
	
	
	it("Prints argument-objects", () => {
		const args = (function(){
			return arguments;
		}("A", "B", {a: "C"}));
		
		expect(args).to.print(`Arguments[
			"A"
			"B"
			{
				a: "C"
			}
			@@Symbol.iterator: function(){
				length: 0
				name: "values"
			}
		]`)
	});
});


describe("Classes", function(){
	
	class Example{
		constructor(){
			this.name = "Foo";
		}
	}
	
	class ExtendedExample extends Example{
		constructor(){
			super();
			this.name = "Bar";
		}
	}

	it("Prints class instances", () => {
		Chai.unindent(3);
		expect(new Example()).to.print(`
			Example{
				name: "Foo"
			}
		`);
	});
	
	
	it("Prints instances of subclasses", () => {
		expect(new ExtendedExample()).to.print(`
			ExtendedExample{
				name: "Bar"
			}
		`)
	});
});


describe("Lists", function(){
	const binary = fs.readFileSync(path.resolve(__dirname, "fixtures", "bytes.o"));
	
	it("Prints arrays", () => {
		Chai.unindent(2);
		expect([
			"Apple",
			"Orange",
			"Microsoft",
			"Sun",
			"Google",
			"Gravity",
			"Random"
		]).to.print(`[
			"Apple"
			"Orange"
			"Microsoft"
			"Sun"
			"Google"
			"Gravity"
			"Random"
		]`);
	});
	
	
	it("Prints data buffers", () => {
		expect(binary).to.print(`Buffer[
			195
			132
			0
			203
			135
			33
			10
		]`);
	});
	
	
	it("Prints typed arrays", () => {
		expect(new Uint16Array(5)).to.print(`Uint16Array[
			0
			0
			0
			0
			0
		]`);
		
		expect(new Float64Array(5)).to.print(`Float64Array[
			0
			0
			0
			0
			0
		]`);
	});
	
	
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
		beforeEach(() => Chai.unindent(3));
		
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
	});
	
	
	describe("Sets", () => {
		beforeEach(() => Chai.unindent(3));
		
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
	
	
	describe("Named properties", () => {
		beforeEach(() => Chai.unindent(3));
		
		it("Shows named properties in arrays", () => {
			const array = "ABCdef".match(/(\w)(\w)/);
			expect(array).to.print(`[
				"AB"
				"A"
				"B"
				index: 0
				input: "ABCdef"
			]`);
		});
		
		it("Shows custom properties in data buffers", () => {
			binary.customValue = "Something important";
			expect(binary).to.print(`Buffer[
				195
				132
				0
				203
				135
				33
				10
				customValue: "Something important"
			]`)
		})
	});
});
