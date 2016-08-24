"use strict";

const fs     = require("fs");
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
		const output =
		`Example{
			name: "Foo"
		}`;
		expect(new Example()).to.print(output);
	});
	
	
	it("Prints instances of subclasses", () => {
		const output = 
		`ExtendedExample{
			name: "Bar"
		}`;
		expect(new ExtendedExample()).to.print(output)
	});
});
