"use strict";

const fs     = require("fs");
const path   = require("path");
const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
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
	});


	describe("Data buffers", () => {
		const binary = fs.readFileSync(path.resolve(__dirname, "fixtures", "bytes.o"));
		
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
