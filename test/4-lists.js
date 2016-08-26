"use strict";

const print    = require("../print.js");
const Chai     = require("./chai-spice.js");
const {slurp}  = require("./helpers.js");
const {expect} = Chai;


describe("Lists", function(){
	Chai.untab = 3;
	
	describe("Arrays", () => {
		it("Prints arrays", () => {
			expect([
				"Apple",
				"Orange",
				"Microsoft",
				"Sun",
				"Google",
				"Gravity",
				"Random"
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
		
		it("Prints empty arrays on one line", () => {
			expect([]).to.print("[]");
		});
		
		it("Shows named properties", () => {
			const array = "ABCdef".match(/(\w)(\w)/);
			expect(array).to.print(`[
				"AB"
				"A"
				"B"
				index: 0
				input: "ABCdef"
			]`);
		});
		
		
		describe("Options", () => {
			Chai.untab = 4;
			
			it("Numbers each element if showArrayIndices is set", () => {
				const output = `[
					0: 1
					1: 2
					2: 3
				]`;
				expect([1, 2, 3]).to.print(output, {
					showArrayIndices: true
				});
			});
			
			
			it("Shows the array's size when showArrayLength is set", () => {
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
			
			
			it("Show both numbers and size when both options are set", () => {
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
			
			
			it("Truncates long arrays by default", () => {
				Chai.untab = false;
				const output = slurp("fixtures/long-array.txt").trim();
				expect(new Array(2445).fill(0)).to.print(output);
			});
			
			
			
			const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
			
			it("Truncates to different values set by maxArrayLength", () => {
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
			
			it("Manages to combine all options together", () => {
				const output = `[
					0: 1
					1: 2
					2: 3
					
					… 7 more values not shown
					
					length: 10
				]`;
				expect(input).to.print(output, allOpts);
			});
			
			
			it("Can also do so with extra named properties attached", () => {
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


	describe("Data buffers", () => {
		const binary = slurp("fixtures/bytes.o", true);
		
		it("Prints data buffers", () => {
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
		
		it("Shows custom properties", () => {
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
			]`)
		});
	});
	
	
	describe("Typed arrays", () => {
		it("Prints typed arrays", () => {
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
	});
});
