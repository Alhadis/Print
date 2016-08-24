"use strict";

const fs     = require("fs");
const path   = require("path");
const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


describe("Basic objects", function(){
	Chai.untab = 2;
	
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
	Chai.untab = 3;
	
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
	Chai.untab = 2;
	const binary = fs.readFileSync(path.resolve(__dirname, "fixtures", "bytes.o"));
	
	it("Prints arrays", () => {
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
	
	
	describe("Named properties", () => {
		Chai.untab = 3;
		
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
