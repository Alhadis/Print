"use strict";

const fs     = require("fs");
const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


describe("Objects", () => {
	Chai.untab = 3;
	
	describe("Plain objects", () => {
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
	});
	
	describe("Property names", () => {
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
		Chai.untab = 4;
		
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
			`);
		});
	});
	
	describe("Dates", () => {
		Chai.untab = 0;
		
		it("Prints the date's value in ISO format", () => {
			const date = new Date("2000-12-31T18:02:16.555Z");
			expect(print(date)).to.match(/^Date{\n\t2000-12-31 18:02:16\.555 GMT\n\t\d+ years ago\n}$/)
		});
		
		it("Trims zeroes from the millisecond component", () => {
			const dates = [
				["16.000Z", "16 GMT"],
				["16.120Z", "16.12 GMT"],
				["16.050Z", "16.05 GMT"],
				["16.500Z", "16.5 GMT"]
			];
			for(const [before, after] of dates){
				const date = new Date(`2016-12-31 18:02:${before}`);
				const line = print(date).split(/\n/)[1];
				expect(line).to.equal(`\t2016-12-31 18:02:${after}`);
			}
		});
		
		it("Shows named properties", () => {
			const date = new Date("2000-10-10T10:02:02Z");
			date.foo = "bar";
			date.list = ["Alpha", "Beta", "Delta"];
			expect(print(date)).to.match(/^Date{\n\t2000-10-10 10:02:02 GMT\n\t\d+ years ago\n\t\n\tfoo: "bar"\n\tlist: \[\n\t\t"Alpha"\n\t\t"Beta"\n\t\t"Delta"\n\t\]\n}$/);
		});
		
		describe("Time differences", () => {
			let suffix = "ago";
			let future = false;
			
			const tests = [
				["Includes a human-readable time difference", function(){
					const dates = [
						[1500000, "25 minutes"],
						[120000,   "2 minutes"],
						[2000,     "2 seconds"],
						[50000,   "50 seconds"],
						[13680000, "3.8 hours"],
						[388800000, "4.5 days"],
						[10512e6,   "4 months"],
						[126144e6,   "4 years"]
					];
					for(let [offset, diff] of dates){
						if(future) offset = -offset;
						const date = new Date(Date.now() - offset);
						const line = print(date).split(/\n/)[2];
						expect(line).to.equal(`\t${diff} ${suffix}`);
					}
				}],
				
				["Rounds differences off to 1 decimal place", function(){
					const dates = [
						[11719800, "3.3 hours"],
						[487296000, "5.6 days"],
						[211620, "3.5 minutes"],
						[13201560, "3.7 hours"]
					];
					for(let [offset, diff] of dates){
						if(future) offset = -offset;
						const date = new Date(Date.now() - offset);
						const line = print(date).split(/\n/)[2];
						expect(line).to.equal(`\t${diff} ${suffix}`);
					}
				}],
				
				["Doesn't display fractional seconds", function(){
					const date = new Date(Date.now() - (future ? -2500 : 2500));
					const line = print(date).split(/\n/)[2];
					expect(line).to.equal("\t3 seconds " + suffix);
				}],
				
				["Doesn't display fractional intervals longer than a week", function(){
					const dates = [
						[9637138800, "4 months"],
						[1343520000,  "16 days"],
						[1321920000,  "15 days"],
						[725760000,    "8 days"],
						[743040000,    "9 days"],
						[570240000,  "6.6 days"]
					];
					for(let [offset, diff] of dates){
						if(future) offset = -offset;
						const date = new Date(Date.now() - offset);
						const line = print(date).split(/\n/)[2];
						expect(line).to.equal(`\t${diff} ${suffix}`);
					}
				}]
			];
			
			for(const [testName, testHandler] of tests)
				it(testName, testHandler);
			
			suffix = "from now";
			future = true;
			
			it("Can read dates in the future", () => {
				for(const [testName, testHandler] of tests)
					testHandler();
			});
		});
	});
	
	describe("Errors", function(){
		it("Prints plain errors", () => {
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
				code: "ERR_ASSERTION"
				expected: false
				generatedMessage: false
				intentional: true
				message: "Wrong"
				name: "AssertionError [ERR_ASSERTION]"
				operator: "=="
			}`);
		});
	});
	
	describe("Regular expressions", () => {
		it("Prints simple regex",   () => expect(/a/).to.print("/a/"));
		it("Prints flags",          () => expect(/a/i).to.print("/a/i"));
		it("Prints multiple flags", () => expect(/a/gmi).to.print("/a/gim"));
		it("Prints hairy regex",    () => {
			let exp = require.resolve("./fixtures/hairy-regex.js");
			let src = fs.readFileSync(exp).toString().replace(/^(?!\t).+\n?$|^\t+|,$/gm, "").split(/\n/g).filter(Boolean);
			exp = require(exp);
			src.forEach((str, index) => expect(exp[index]).to.print(str));
		});
		it("Displays value of .lastIndex if non-zero", () => {
			const value = /abc|xyz/g;
			expect(value).to.print("/abc|xyz/g");
			value.exec("< xyz >");
			expect(value).to.print(`RegExp{
				/abc|xyz/g
				
				lastIndex: 5
			}`);
			value.lastIndex = false;
			expect(value).to.print(`RegExp{
				/abc|xyz/g
				
				lastIndex: false
			}`);
		});
		it("Displays named properties", () => {
			const value = /abc|xyz/gi;
			value.foo = "Foo";
			expect(value).to.print(`RegExp{
				/abc|xyz/gi
				
				foo: "Foo"
			}`);
			value.bar = "Bar";
			expect(value).to.print(`RegExp{
				/abc|xyz/gi
				
				bar: "Bar"
				foo: "Foo"
			}`);
		});
		it("Displays both named properties and non-zero .lastIndex", () => {
			const value = /abc|xyz/gi;
			value.foo = "Foo";
			value.exec("< xyz >");
			expect(value).to.print(`RegExp{
				/abc|xyz/gi
				
				foo: "Foo"
				lastIndex: 5
			}`);
			value.zzz = "Sleepy";
			value.lastIndex = null;
			expect(value).to.print(`RegExp{
				/abc|xyz/gi
				
				foo: "Foo"
				lastIndex: null
				zzz: "Sleepy"
			}`);
		});
		it("Identifies subclasses", () => {
			class PCRE extends RegExp{
				constructor(...args){
					super(...args);
				}
			}
			const regex = new PCRE("ABC|XYZ", "gi");
			expect(regex).to.print(`PCRE{
				/ABC|XYZ/gi
			}`);
			regex.foo = "Foo";
			expect(regex).to.print(`PCRE{
				/ABC|XYZ/gi
				
				foo: "Foo"
			}`);
			regex.exec("ABC");
			expect(regex).to.print(`PCRE{
				/ABC|XYZ/gi
				
				foo: "Foo"
				lastIndex: 3
			}`);
		});
	});
	
	describe("Booleans", () => {
		it("Displays internal values", () => {
			expect(new Boolean("Yes")).to.print(`Boolean{
				true
			}`);
			expect(new Boolean(false)).to.print(`Boolean{
				false
			}`);
			expect(new Boolean()).to.print(`Boolean{
				false
			}`);
		});
		
		it("Displays internal values truthfully", () => {
			const value = new Boolean("Yes");
			value.valueOf = function(){ return false; }
			value.toString = function(){ return "Nah"; }
			expect(value).to.print(`Boolean{
				true
				
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
		
		it("Identifies subclasses", () => {
			class ExtendedBoolean extends Boolean{}
			const value = new ExtendedBoolean("Yes");
			expect(value).to.print(`ExtendedBoolean{
				true
			}`);
			value.foo = "Foo";
			expect(value).to.print(`ExtendedBoolean{
				true
				
				foo: "Foo"
			}`);
		});
		
		it("Displays their internal values truthfully", () => {
			class WeirdBoolean extends Boolean{
				toString(){ return "Nah"; }
				valueOf(){ return !super.valueOf(); }
			}
			expect(new WeirdBoolean(true)).to.print(`WeirdBoolean{
				true
			}`);
			expect(new WeirdBoolean(false)).to.print(`WeirdBoolean{
				false
			}`);
		});
	});
	
	describe("Numbers", () => {
		it("Displays internal values", () => {
			expect(new Number(64)).to.print(`Number{
				64
			}`);
			expect(new Number(-326.2)).to.print(`Number{
				-326.2
			}`);
		});
		
		it("Displays internal values truthfully", () => {
			const value = new Number(258);
			value.valueOf = function(){ return 30; };
			expect(value).to.print(`Number{
				258
				
				valueOf: function(){
					length: 0
					name: ""
				}
			}`);
			value.toString = function(){ return "982"; }
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
		
		const {
			MathConstants,
			NumberConstants,
		} = require("./helpers.js");
		
		it("Identifies Math.* constants", () => {
			++Chai.untab;
			for(const constant of MathConstants){
				const value = new Number(Math[constant]);
				expect(value).to.print(`Number{
					Math.${constant}
				}`);
				value.foo = "Foo"
				expect(value).to.print(`Number{
					Math.${constant}
					
					foo: "Foo"
				}`);
			}
			--Chai.untab;
		});
		
		it("Identifies Number.* constants", () => {
			++Chai.untab;
			for(const constant of NumberConstants){
				const value = new Number(Number[constant]);
				expect(value).to.print(`Number{
					Number.${constant}
				}`);
				value.foo = "Foo"
				expect(value).to.print(`Number{
					Number.${constant}
					
					foo: "Foo"
				}`);
			}
			--Chai.untab;
		});
		
		it("Shows named properties", () => {
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
		
		it("Identifies subclasses", () => {
			class ExtendedNumber extends Number{}
			let value = new ExtendedNumber(300);
			expect(value).to.print(`ExtendedNumber{
				300
			}`);
			value.foo = "Foo";
			expect(value).to.print(`ExtendedNumber{
				300
				
				foo: "Foo"
			}`);
			
			class DoubleExtendedNumber extends ExtendedNumber{
				constructor(value, name){
					super(value * 2);
					this.name = name;
				}
			}
			value = new DoubleExtendedNumber(32, "foo");
			expect(value).to.print(`DoubleExtendedNumber{
				64
				
				name: "foo"
			}`);
			value.bar = "Bar";
			expect(value).to.print(`DoubleExtendedNumber{
				64
				
				bar: "Bar"
				name: "foo"
			}`);
		});
		
		it("Displays their internal values truthfully", () => {
			class WeirdNumber extends Number{
				constructor(value){
					super(value);
				}
				
				valueOf(){
					return -752;
				}
				
				toString(){
					return "Nah";
				}
			}
			
			const value = new WeirdNumber(32);
			expect(value).to.print(`WeirdNumber{
				32
			}`);
			value.foo = "Foo";
			expect(value).to.print(`WeirdNumber{
				32
				
				foo: "Foo"
			}`);
		});
	});
	
	describe("Strings", () => {
		it("Displays internal values", () => {
			const value = new String("ABC");
			expect(value).to.print(`String{
				"ABC"
				
				0: "A"
				1: "B"
				2: "C"
			}`);
		});
		
		it("Escapes whitespace characters in internal values", () => {
			++Chai.untab; // IDEA: Nuke this dumb "Chai.untab" crap
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
			--Chai.untab;
		});
		
		it("Displays internal values truthfully", () => {
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
		
		it("Shows named properties", () => {
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
		
		it("Identifies subclasses", () => {
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
		
		it("Displays their internal values truthfully", () => {
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
