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
		function func(i){ return i + 2; }
		expect(func).to.print(`function(){
			length: 1
			name: "func"
		}`);
	});
	
	it("prints anonymous functions", () => {
		expect(() => "A").to.print(`function(){
			length: 0
			name: ""
		}`);
	});
	
	it("prints methods", () => {
		expect({
			func: function fn(value){
				return value;
			},
		}).to.print(`{
			func: function(){
				length: 1
				name: "fn"
			}
		}`);
	});

	it("identifies generator functions", () => {
		function* bar(){ yield 20; }
		expect(bar).to.print(`function*(){
			length: 0
			name: "bar"
		}`);
		expect({method: bar}).to.print(`{
			method: function*(){
				length: 0
				name: "bar"
			}
		}`);
	});
	
	(asyncFunc ? it : it.skip)("identifies asynchronous functions", () => {
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
	});
	
	(asyncGen ? it : it.skip)("identifies asynchronous generators", () => {
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
	});
});
