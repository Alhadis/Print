"use strict";

const {expect} = require("chai");

const MathConstants = [
	"E",
	"LN10",
	"LN2",
	"LOG10E",
	"LOG2E",
	"PI",
	"SQRT1_2",
	"SQRT2",
];
const NumberConstants = [
	"EPSILON",
	"MIN_VALUE",
	"MAX_VALUE",
	"MIN_SAFE_INTEGER",
	"MAX_SAFE_INTEGER",
	"NEGATIVE_INFINITY",
	"POSITIVE_INFINITY",
];

describe("Numbers", () => {
	describe("Primitives", () => {
		it("prints positive integers", () => expect(42).to.print("42"));
		it("prints negative integers", () => expect(-42).to.print("-42"));
		it("prints positive floats",   () => expect(4.2).to.print("4.2"));
		it("prints negative floats",   () => expect(-4.2).to.print("-4.2"));
		it("shortens long numbers",    () => expect(1e64).to.print("1e+64"));
		
		it("identifies Math.* constants", () => {
			for(const constant of MathConstants)
				expect(Math[constant]).to.print("Math." + constant);
		});
		
		it("identifies Number.* constants", () => {
			for(const constant of NumberConstants)
				expect(Number[constant]).to.print("Number." + constant);
		});
	});

	describe("Objects", () => {
		it("displays internal values", () => {
			expect(new Number(64)).to.print(`Number{
				64
			}`);
			expect(new Number(-326.2)).to.print(`Number{
				-326.2
			}`);
		});
		
		it("displays internal values reliably", () => {
			const value = new Number(258);
			value.valueOf = function(){ return 30; };
			expect(value).to.print(`Number{
				258
				
				valueOf: function(){
					length: 0
					name: ""
				}
			}`);
			value.toString = function(){ return "982"; };
			expect(value).to.print(`Number{
				258
				
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
		
		it("identifies Math.* constants", () => {
			for(const constant of MathConstants){
				const value = new Number(Math[constant]);
				expect(value).to.print(`Number{
					Math.${constant}
				}`);
				value.foo = "Foo";
				expect(value).to.print(`Number{
					Math.${constant}
					
					foo: "Foo"
				}`);
			}
		});
		
		it("identifies Number.* constants", () => {
			for(const constant of NumberConstants){
				const value = new Number(Number[constant]);
				expect(value).to.print(`Number{
					Number.${constant}
				}`);
				value.foo = "Foo";
				expect(value).to.print(`Number{
					Number.${constant}
					
					foo: "Foo"
				}`);
			}
		});
		
		it("shows named properties", () => {
			const value = new Number(48);
			value.foo = "Foo";
			expect(value).to.print(`Number{
				48
				
				foo: "Foo"
			}`);
			value.bar = "Bar";
			expect(value).to.print(`Number{
				48
				
				bar: "Bar"
				foo: "Foo"
			}`);
		});
	});
	
	describe("Subclasses", () => {
		class Double    extends Number{ constructor(n){ super(n * 2); }}
		class Quadruple extends Double{ constructor(n){ super(n * 2); }}
		
		it("identifies subclasses", () => {
			expect(new Double(150)).to.print(`Double{
				300
			}`);
		});
		
		it("shows named properties", () => {
			const value = new Double(150);
			value.foo = "Foo";
			expect(value).to.print(`Double{
				300
				
				foo: "Foo"
			}`);
		});
		
		it("identifies subclasses of subclasses", () => {
			const value = new Quadruple(150);
			expect(value).to.print(`Quadruple{
				600
			}`);
			value.bar = "Bar";
			expect(value).to.print(`Quadruple{
				600
				
				bar: "Bar"
			}`);
		});
		
		it("displays internal values reliably", () => {
			class LyingNumber extends Number{
				toString(){ return "Nah"; }
				valueOf(){ return -752; }
			}
			const value = new LyingNumber(32);
			expect(value).to.print(`LyingNumber{
				32
			}`);
			value.foo = "Foo";
			expect(value).to.print(`LyingNumber{
				32
				
				foo: "Foo"
			}`);
		});
	});
});
