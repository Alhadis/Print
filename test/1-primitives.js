"use strict";

const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;

describe("Primitives", () => {
	it("Prints null",      () => expect(null).to.print("null"));
	it("Prints undefined", () => expect().to.print("undefined"));
	it("Prints true",      () => expect(true).to.print("true"));
	it("Prints false",     () => expect(false).to.print("false"));
	it("Prints NaN",       () => expect(NaN).to.print("NaN"));
	it("Prints symbols",   () => expect(Symbol("Foo")).to.print("Symbol(Foo)"));

	describe("Numbers", () => {
		it("Prints numbers", () => expect(42).to.print("42"));
		it("Prints floats",  () => expect(4.2).to.print("4.2"));
		it("Shortens long numbers", () => expect(1e64).to.print("1e+64"));
		it("Prints negative values", () => expect(-42).to.print("-42"));
		
		const {MathConstants, NumberConstants} = require("./helpers.js");
		it("Identifies Math.* constants", () => {
			for(const constant of MathConstants)
				expect(Math[constant]).to.print("Math." + constant);
		});
		
		it("Identifies Number.* constants", () => {
			for(const constant of NumberConstants)
				expect(Number[constant]).to.print("Number." + constant);
		});
	});

	describe("Strings", () => {
		it("Prints strings",    () => expect("Foo").to.print('"Foo"'));
		it("Escapes tabs",      () => expect("\t").to.print('"\\t"'));
		it("Escapes newlines",  () => expect("\n").to.print('"\\n"'));
		it("Escapes formfeeds", () => expect("\f").to.print('"\\f"'));
		it("Doesn't escape whitespace if escapeChars is disabled", () => {
			expect("\t").to.print('"\t"', {escapeChars: false});
			expect("\n").to.print('"\n"', {escapeChars: false});
			expect("\f").to.print('"\f"', {escapeChars: false});
		});
		
		it("Allows custom character-ranges to be escaped", () => {
			const chr = String.fromCodePoint(0x1F44C);
			expect("T").to.print('"\\x54"',      {escapeChars: /[A-Z]/  });
			expect(chr).to.print('"\\u{1F44C}"', {escapeChars: /[^A-Z]+/});
		});
		
		it("Allows user-supplied functions to handle escaping", () => {
			expect("abc").to.print('"ABC"', {escapeChars: s => s.toUpperCase()});
		});
	});
});
