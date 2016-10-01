"use strict";

const fs     = require("fs");
const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


Chai.untab = 2;

describe("Basic objects", function(){
	
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
	
	
	it("Prints empty objects on one line", () => {
		expect({}).to.print("{}");
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
	
	
	describe("Property names", () => {
		Chai.untab = 3;
		
		const input = [
			{
				gamma: "G",
				delta: "D",
				alpha: "A",
				beta:  "B",
				quux:  "Q",
				__FB:  "FooBar"
			},
			
			{
				ZZZZ: 0,
				aaaa: 1,
				AaAA: 2,
				bbBB: 3
			}
		];
		
		it("Alphabetises each property's name by default", () => {
			expect(input[0]).to.print(`{
				__FB: "FooBar"
				alpha: "A"
				beta: "B"
				delta: "D"
				gamma: "G"
				quux: "Q"
			}`);
		});
		
		it("Alphabetises case-insensitively", () => {
			expect(input[1]).to.print(`{
				aaaa: 1
				AaAA: 2
				bbBB: 3
				ZZZZ: 0
			}`);
		});
		
		it("Preserves enumeration order if sortProps is disabled", () => {
			expect(input[0]).to.print(`{
				gamma: "G"
				delta: "D"
				alpha: "A"
				beta: "B"
				quux: "Q"
				__FB: "FooBar"
			}`, {sortProps: false});
		});
		
		const symb = Symbol("Fancy-Symbol");
		it("Uses a @@-prefix to indicate Symbol-keyed properties", () => {
			expect({[symb]: true}).to.print(`{
				@@Fancy-Symbol: true
			}`);
		});
		
		it("Omits the @@-prefix if ampedSymbols is disabled", () => {
			expect({[symb]: true}).to.print(`{
				Symbol(Fancy-Symbol): true
			}`, {ampedSymbols: false})
		});
	});
});



describe("Errors", function(){
	
	it("Prints standard errors", () => {
		expect(new Error("Nope")).to.print(`Error{
			message: "Nope"
			name: "Error"
		}`);
	});
	
	it("Prints AssertionErrors", () => {
		let error;
		try{ require("assert").equal(true, false, "Wrong"); }
		catch(e){ error = e; }
		
		error.intentional = true;
		expect(error).to.print(`AssertionError{
			actual: true
			expected: false
			generatedMessage: false
			intentional: true
			message: "Wrong"
			name: "AssertionError"
			operator: "=="
		}`);
	});
});


describe("Functions", () => {
	
	it("Prints function objects", () => {
		const func = function(i){ return i + 2 }
		expect(func).to.print(`function(){
			length: 1
			name: "func"
		}`);
	});
	
	it("Prints nameless functions", () => {
		expect(function(){return "A"}).to.print(`function(){
			length: 0
			name: ""
		}`);
	});
	
	it("Prints functions in objects", () => {
		expect({
			func: function fn(value){
				return value;
			}
		}).to.print(`{
			func: function(){
				length: 1
				name: "fn"
			}
		}`);
	});
	
	it("Recognises generator functions", () => {
		const obj = { money: function* generator(){ yield $20; } };
		expect(obj).to.print(`{
			money: function*(){
				length: 0
				name: "generator"
			}
		}`);
	});
	
	it("Avoids breaking on absent constructors", () => {
		const obj = {get constructor(){ return undefined }};
		expect(obj).to.print(`{
			constructor: undefined
		}`);
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
