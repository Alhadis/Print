"use strict";

const {expect} = require("chai");

describe("Functions", () => {
	it("prints named functions", () => {
		const func = function(i){ return i + 2; };
		expect(func).to.print(`function(){
			length: 1
			name: "func"
		}`);
	});
	
	it("prints anonymous functions", () => {
		expect(function(){return "A";}).to.print(`function(){
			length: 0
			name: ""
		}`);
	});
	
	it("prints methods", () => {
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
	
	it("recognises generator functions", () => {
		const obj = { money: function* generator(){ yield $20; } };
		expect(obj).to.print(`{
			money: function*(){
				length: 0
				name: "generator"
			}
		}`);
	});
	
	it("avoids breaking on absent constructors", () => {
		const obj = {get constructor(){ return undefined; }};
		expect(obj).to.print(`{
			constructor: undefined
		}`);
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

		it("prints class instances", () => {
			expect(new Example()).to.print(`
				Example{
					name: "Foo"
				}
			`);
		});
		
		it("prints instances of subclasses", () => {
			expect(new ExtendedExample()).to.print(`
				ExtendedExample{
					name: "Bar"
				}
			`);
		});
	});
});
