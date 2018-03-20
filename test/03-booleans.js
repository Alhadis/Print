"use strict";

const {expect} = require("chai");

describe("Booleans", () => {
	describe("Primitives", () => {
		it("prints true",  () => expect(true).to.print("true"));
		it("prints false", () => expect(false).to.print("false"));
	});
	
	describe("Objects", () => {
		it("displays internal values", () => {
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
		
		it("displays internal values reliably", () => {
			const value = new Boolean("Yes");
			value.valueOf = function(){ return false; };
			value.toString = function(){ return "Nah"; };
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
	});
	
	describe("Subclasses", () => {
		it("identifies subclasses", () => {
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
		
		it("displays internal values reliably", () => {
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
});
