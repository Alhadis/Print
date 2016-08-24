"use strict";

const assert = require("assert");
const fs     = require("fs");

const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


describe("Basic values", function(){
	it("Prints numbers",   () => expect(42).to.print("42"));
	it("Prints strings",   () => expect("Foo").to.print('"Foo"'));
	it("Prints floats",    () => expect(4.2).to.print("4.2"));
});

describe("Primitives", function(){
	it("Prints null",      () => expect(null).to.print("null"));
	it("Prints undefined", () => expect().to.print("undefined"));
	it("Prints true",      () => expect(true).to.print("true"));
	it("Prints false",     () => expect(false).to.print("false"));
	it("Prints NaN",       () => expect(NaN).to.print("NaN"));
});

describe("Basic data objects", function(){
	it("Prints symbols",   () => expect(Symbol("Foo")).to.print("Symbol(Foo)"));
});


describe("Numerical constants", function(){
	it("Prints Math.* constants", () => {
		for(const constant of "E LN10 LN2 LOG10E LOG2E PI SQRT1_2 SQRT2".split(" "))
			expect(Math[constant]).to.print("Math." + constant);
	});
	
	it("Prints Number.* constants", () => {
		const names = `
			EPSILON
			MIN_VALUE
			MAX_VALUE
			MIN_SAFE_INTEGER
			MAX_SAFE_INTEGER
			NEGATIVE_INFINITY
			POSITIVE_INFINITY
		`;
		
		for(const name of names.split(/\s+/g).filter(Boolean))
			expect(Number[name]).to.print("Number." + name);
	});
});


describe("Regular expressions", function(){
	it("Prints simple regex",   () => expect(/a/).to.print("/a/"));
	it("Prints flags",          () => expect(/a/i).to.print("/a/i"));
	it("Prints multiple flags", () => expect(/a/gmi).to.print("/a/gim"));
});
