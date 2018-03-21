"use strict";

const {expect} = require("chai");
const {slurp}  = require("./helpers.js");
const print    = require("../print.js");

const binary = slurp("fixtures/bytes.o", true);
const args = (function(){ return arguments; }("A", "B", {a: "C"}));

describe("Arrays", () => {
	it("prints arrays", () => {
		expect([
			"Apple",
			"Orange",
			"Microsoft",
			"Sun",
			"Google",
			"Gravity",
			"Random",
		]).to.print(`[
			"Apple"
			"Orange"
			"Microsoft"
			"Sun"
			"Google"
			"Gravity"
			"Random"
		]`);
	});
	
	it("prints typed arrays", () => {
		expect(new Uint16Array(5)).to.print(`Uint16Array[
			0
			0
			0
			0
			0
		]`);
		expect(new Float64Array(5)).to.print(`Float64Array[
			0
			0
			0
			0
			0
		]`);
	});
	
	it("prints data buffers", () => {
		expect(binary).to.print(`Buffer[
			195
			132
			0
			203
			135
			33
			10
		]`);
	});
	
	it("prints argument lists", () => {
		expect(args).to.print(`Arguments[
			"A"
			"B"
			{
				a: "C"
			}
		]`);
	});
	
	it("prints empty arrays on one line", () => {
		expect([]).to.print("[]");
		expect(new Buffer("")).to.print("Buffer[]");
		expect(new Uint16Array(0)).to.print("Uint16Array[]");
		expect(new Float64Array(0)).to.print("Float64Array[]");
	});
	
	it("shows named properties", () => {
		const array = "ABCdef".match(/(\w)(\w)/);
		expect(array).to.print(`[
			"AB"
			"A"
			"B"
			index: 0
			input: "ABCdef"
		]`);
		binary.customValue = "Something important";
		expect(binary).to.print(`Buffer[
			195
			132
			0
			203
			135
			33
			10
			customValue: "Something important"
		]`);
		args.customValue = "Something important";
		expect(args).to.print(`Arguments[
			"A"
			"B"
			{
				a: "C"
			}
			customValue: "Something important"
		]`);
	});
	
	
	describe("Options", () => {
		it("numbers each element if showArrayIndices is set", () => {
			const output = `[
				0: 1
				1: 2
				2: 3
			]`;
			expect([1, 2, 3]).to.print(output, {
				showArrayIndices: true
			});
		});
		
		it("shows the array's size when showArrayLength is set", () => {
			const output = `[
				1
				2
				3
				length: 3
			]`;
			expect([1, 2, 3]).to.print(output, {
				showArrayLength: true
			});
		});
		
		it("show both numbers and size when both options are set", () => {
			const output = `[
				0: 1
				1: 2
				2: 3
				length: 3
			]`;
			expect([1, 2, 3]).to.print(output, {
				showArrayLength: true,
				showArrayIndices: true
			});
		});
		
		it("truncates long arrays by default", () => {
			const output = slurp("fixtures/long-array.txt").trim();
			expect(print(new Array(2445).fill(0))).to.equal(output);
		});
		
		
		const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
		
		it("truncates to different values set by maxArrayLength", () => {
			const output = `[
				1
				2
				3
				
				… 7 more values not shown
			]`;
			expect(input).to.print(output, {
				maxArrayLength: 3
			});
		});
		
		
		const allOpts = {
			showArrayLength: true,
			showArrayIndices: true,
			maxArrayLength: 3
		};
		
		it("manages to combine all options together", () => {
			const output = `[
				0: 1
				1: 2
				2: 3
				
				… 7 more values not shown
				
				length: 10
			]`;
			expect(input).to.print(output, allOpts);
		});
		
		it("can also do so with extra named properties attached", () => {
			input.foo = "Bar";
			input.baz = {
				quuz: "Quux",
				foobar: "FooBar",
				needs: {
					more: "foo"
				}
			};
			
			const output = `[
				0: 1
				1: 2
				2: 3
				
				… 7 more values not shown
				
				baz: {
					foobar: "FooBar"
					needs: {
						more: "foo"
					}
					quuz: "Quux"
				}
				foo: "Bar"
				length: 10
			]`;
			expect(input).to.print(output, allOpts);
		});
	});
});
