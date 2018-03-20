"use strict";

const {expect} = require("chai");

let asyncFunc = false;
let asyncGen  = false;
try{
	asyncFunc = Function("return async function bar(){ return 20; };")();
	asyncGen  = Function("return async function* bar(){ yield 20; };")();
} catch(e){}

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
	
	it("avoids breaking on absent constructors", () => {
		const obj = {get constructor(){ return undefined; }};
		expect(obj).to.print(`{
			constructor: undefined
		}`);
	});

	it("identifies generator functions", () => {
		const foo = function* bar(){ yield 20; };
		expect(foo).to.print(`function*(){
			length: 0
			name: "bar"
		}`);
		expect({method: foo}).to.print(`{
			method: function*(){
				length: 0
				name: "bar"
			}
		}`);
	});
	
	it("identifies asynchronous functions", asyncFunc ? () => {
		expect(asyncFunc).to.print(`async function(){
			length: 0
			name: "bar"
		}`);
		expect({method: asyncFunc}).to.print(`{
			method: async function(){
				length: 0
				name: "bar"
			}
		}`);
	} : undefined);
	
	it("identifies asynchronous generators", asyncGen ? () => {
		expect(asyncGen).to.print(`async function*(){
			length: 0
			name: "bar"
		}`);
		expect({method: asyncGen}).to.print(`{
			method: async function*(){
				length: 0
				name: "bar"
			}
		}`);
	} : undefined);
});
