"use strict";

const {expect} = require("chai");

describe("Strings", () => {
	describe("Primitives", () => {
		it("prints strings",    () => expect("Foo").to.print('"Foo"'));
		it("escapes tabs",      () => expect("\t").to.print('"\\t"'));
		it("escapes newlines",  () => expect("\n").to.print('"\\n"'));
		it("escapes formfeeds", () => expect("\f").to.print('"\\f"'));
		it("doesn't escape whitespace if escapeChars is disabled", () => {
			expect("\t").to.print('"\t"', {escapeChars: false});
			expect("\n").to.print('"\n"', {escapeChars: false});
			expect("\f").to.print('"\f"', {escapeChars: false});
		});
		
		it("allows custom character-ranges to be escaped", () => {
			const chr = String.fromCodePoint(0x1F44C);
			expect("T").to.print('"\\x54"',      {escapeChars: /[A-Z]/  });
			expect(chr).to.print('"\\u{1F44C}"', {escapeChars: /[^A-Z]+/});
		});
		
		it("allows user-supplied functions to handle escaping", () => {
			expect("abc").to.print('"ABC"', {escapeChars: s => s.toUpperCase()});
		});
	});
	
	describe("Objects", () => {
		it("displays internal values", () => {
			const value = new String("ABC");
			expect(value).to.print(`String{
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
			}`);
		});
		
		it("escapes whitespace characters in internal values", () => {
			const escapeTests = [
				['"\\t"', new String("\t")],
				['"\\n"', new String("\n")],
				['"\\f"', new String("\f")],
			];
			for(const [char, object] of escapeTests){
				expect(object).to.print(`String{
					${char}
					
					0: ${char}
				}`);
				object.foo = "Foo";
				expect(object).to.print(`String{
					${char}
					
					0: ${char}
					foo: "Foo"
				}`);
			}
		});
		
		it("displays internal values reliably", () => {
			const value = new String("ABC");
			value.toString = function(){ return "XYZ"; };
			value.valueOf = function(){ return "Nah"; };
			expect(value).to.print(`String{
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
				toString: function(){
					length: 0
					name: ""
				}
				valueOf: function(){
					length: 0
					name: ""
				}
			}`);
		});
		
		it("shows named properties", () => {
			const value = new String("XYZ");
			value.foo = "Foo";
			expect(value).to.print(`String{
				"XYZ"
				
				0: "X"
				1: "Y"
				2: "Z"
				foo: "Foo"
			}`);
		});
		
		it("identifies subclasses", () => {
			class ExtendedString extends String{}
			const value = new ExtendedString("XYZ");
			expect(value).to.print(`ExtendedString{
				"XYZ"
				
				0: "X"
				1: "Y"
				2: "Z"
			}`);
			value.foo = "Foo";
			expect(value).to.print(`ExtendedString{
				"XYZ"
				
				0: "X"
				1: "Y"
				2: "Z"
				foo: "Foo"
			}`);
		});
		
		it("displays internal values reliably", () => {
			class WeirdString extends String{
				toString(){ return "XYZ"; }
				valueOf(){ return "XYZ"; }
			}
			const value = new WeirdString("ABC");
			expect(value).to.print(`WeirdString{
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
			}`);
		});
	});
});
