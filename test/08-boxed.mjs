import {expect} from "./helpers.mjs";

describe("Boxed primitives", () => {
	describe("Booleans", () => {
		it("prints internal values", () => {
			expect(new Boolean("Yes")).to.print(`Boolean {
				true
			}`);
			expect(new Boolean(false)).to.print(`Boolean {
				false
			}`);
			expect(new Boolean()).to.print(`Boolean {
				false
			}`);
		});
		
		it("prints properties", () => {
			let value = new Boolean("Yes");
			expect(value).to.print(`Boolean {
				true
			}`);
			value.foo = "Foo";
			expect(value).to.print(`Boolean {
				true
				
				foo: "Foo"
			}`);
			
			value = new Boolean(false);
			expect(value).to.print(`Boolean {
				false
			}`);
			value.bar = "Bar";
			expect(value).to.print(`Boolean {
				false
				
				bar: "Bar"
			}`);
		});
		
		it("identifies subclasses", () => {
			class ExtendedBoolean extends Boolean{}
			const value = new ExtendedBoolean("Yes");
			expect(value).to.print(`ExtendedBoolean {
				true
			}`);
			value.foo = "Foo";
			expect(value).to.print(`ExtendedBoolean {
				true
				
				foo: "Foo"
			}`);
		});
		
		it("resolves internal values with `Boolean#valueOf()`", () => {
			const value = new Boolean("Yes");
			Object.defineProperties(value, {
				valueOf:  {value(){ return false; }},
				toString: {value(){ return "Nah"; }},
			});
			expect(value).to.print(`Boolean {
				true
			}`);
			value.foo = "Foo";
			expect(value).to.print(`Boolean {
				true
				
				foo: "Foo"
			}`);
			
			class WeirdBoolean extends Boolean{
				toString(){ return "Nah"; }
				valueOf(){ return !super.valueOf(); }
			}
			expect(new WeirdBoolean(true)).to.print(`WeirdBoolean {
				true
			}`);
			expect(new WeirdBoolean(false)).to.print(`WeirdBoolean {
				false
			}`);
		});
	});

	describe("Numbers", () => {
		it("prints internal values", () => {
			expect(new Number(64)).to.print(`Number {
				64
			}`);
			expect(new Number(-326.2)).to.print(`Number {
				-326.2
			}`);
		});
		
		it("prints properties", () => {
			const value = new Number(48);
			value.foo = "Foo";
			expect(value).to.print(`Number {
				48
				
				foo: "Foo"
			}`);
			value.bar = "Bar";
			expect(value).to.print(`Number {
				48
				
				foo: "Foo"
				bar: "Bar"
			}`);
		});
		
		it("identifies subclasses", () => {
			class Double    extends Number{ constructor(n){ super(n * 2); }}
			class Quadruple extends Double{ constructor(n){ super(n * 2); }}
			
			let value = new Double(150);
			expect(value).to.print(`Double {
				300
			}`);
			value.foo = "Foo";
			expect(value).to.print(`Double {
				300
				
				foo: "Foo"
			}`);
			
			value = new Quadruple(150);
			expect(value).to.print(`Quadruple {
				600
			}`);
			value.bar = "Bar";
			expect(value).to.print(`Quadruple {
				600
				
				bar: "Bar"
			}`);
		});
		
		it("identifies Math.* constants", () => {
			class MathConstant extends Number{}
			for(const constant of "E LN10 LN2 LOG10E LOG2E PI SQRT1_2 SQRT2".split(" ")){
				let value = new Number(Math[constant]);
				expect(value).to.print(`Number {
					Math.${constant}
				}`);
				value.foo = "Foo";
				expect(value).to.print(`Number {
					Math.${constant}
					
					foo: "Foo"
				}`);
				
				value = new MathConstant(Math[constant]);
				expect(value).to.print(`MathConstant {
					Math.${constant}
				}`);
				value.bar = "Bar";
				expect(value).to.print(`MathConstant {
					Math.${constant}
					
					bar: "Bar"
				}`);
			}
		});
		
		it("identifies Number.* constants", () => {
			class MagicNumber extends Number{}
			const ants = "EPSILON MIN_VALUE MAX_VALUE MIN_SAFE_INTEGER MAX_SAFE_INTEGER".split(" ");
			for(const constant of ants){
				let value = new Number(Number[constant]);
				expect(value).to.print(`Number {
					Number.${constant}
				}`);
				value.foo = "Foo";
				expect(value).to.print(`Number {
					Number.${constant}
					
					foo: "Foo"
				}`);
				
				value = new MagicNumber(Number[constant]);
				expect(value).to.print(`MagicNumber {
					Number.${constant}
				}`);
				value.foo = "Foo";
				expect(value).to.print(`MagicNumber {
					Number.${constant}
					
					foo: "Foo"
				}`);
			}
		});
		
		it("resolves internal values with `Number#valueOf()`", () => {
			let value = new Number(258);
			value.valueOf = function(){ return 30; };
			expect(value).to.print(`Number {
				258
				
				valueOf: Function {
					│1│ function(){ return 30; }
				}
			}`);
			value.toString = function(){ return "982"; };
			expect(value).to.print(`Number {
				258
				
				valueOf: Function {
					│1│ function(){ return 30; }
				}
				toString: Function {
					│1│ function(){ return "982"; }
				}
			}`);
			
			class LyingNumber extends Number{
				toString(){ return "Nah"; }
				valueOf(){ return -752; }
			}
			value = new LyingNumber(32);
			expect(value).to.print(`LyingNumber {
				32
			}`);
			value.foo = "Foo";
			expect(value).to.print(`LyingNumber {
				32
				
				foo: "Foo"
			}`);
		});
	});

	describe("Strings", () => {
		it("prints internal values", () => {
			const value = new String("ABC");
			expect(value).to.print(`String {
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
			}`);
		});
		
		it("prints properties", () => {
			const value = new String("XYZ");
			value.foo = "Foo";
			expect(value).to.print(`String {
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
			expect(value).to.print(`ExtendedString {
				"XYZ"
				
				0: "X"
				1: "Y"
				2: "Z"
			}`);
			value.foo = "Foo";
			expect(value).to.print(`ExtendedString {
				"XYZ"
				
				0: "X"
				1: "Y"
				2: "Z"
				foo: "Foo"
			}`);
		});
		
		it("escapes whitespace characters", () => {
			const escapeTests = [
				['"\\t"', new String("\t")],
				['"\\n"', new String("\n")],
				['"\\f"', new String("\f")],
			];
			class Whitespace extends String{}
			for(const [char, object] of escapeTests){
				expect(object).to.print(`String {
					${char}
					
					0: ${char}
				}`);
				object.foo = "Foo";
				expect(object).to.print(`String {
					${char}
					
					0: ${char}
					foo: "Foo"
				}`);
				
				const ws = new Whitespace(object + "");
				expect(ws).to.print(`Whitespace {
					${char}
					
					0: ${char}
				}`);
				ws.bar = "Bar";
				expect(ws).to.print(`Whitespace {
					${char}
					
					0: ${char}
					bar: "Bar"
				}`);
			}
		});
		
		it("resolves internal values with `String#valueOf()`", () => {
			let value      = new String("ABC");
			value.toString = function(){ return "XYZ"; };
			value.valueOf  = function(){ return "Nah"; };
			expect(value).to.print(`String {
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
				toString: Function {
					│1│ function(){ return "XYZ"; }
				}
				valueOf: Function {
					│1│ function(){ return "Nah"; }
				}
			}`);
			
			class WeirdString extends String{
				toString(){ return "XYZ"; }
				valueOf(){ return "XYZ"; }
			}
			value = new WeirdString("ABC");
			expect(value).to.print(`WeirdString {
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
			}`);
		});
	});
});
