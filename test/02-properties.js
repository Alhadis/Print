"use strict";

const {expect} = require("chai");

describe("Properties", () => {
	describe("Ordering", () => {
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
		
		it("alphabetises properties by default", () => {
			expect(input[0]).to.print(`{
				__FB: "FooBar"
				alpha: "A"
				beta: "B"
				delta: "D"
				gamma: "G"
				quux: "Q"
			}`);
		});
		
		it("alphabetises case-insensitively", () => {
			expect(input[1]).to.print(`{
				aaaa: 1
				AaAA: 2
				bbBB: 3
				ZZZZ: 0
			}`);
		});
		
		it("preserves order if sortProps is disabled", () => {
			expect(input[0]).to.print(`{
				gamma: "G"
				delta: "D"
				alpha: "A"
				beta: "B"
				quux: "Q"
				__FB: "FooBar"
			}`, {sortProps: false});
		});
	});

	describe("Symbols", () => {
		const symb = Symbol("Fancy-Symbol");
		
		it("uses a @@-prefix to indicate Symbol-keyed properties", () => {
			expect({[symb]: true}).to.print(`{
				@@Fancy-Symbol: true
			}`);
		});
		
		it("omits the @@-prefix if ampedSymbols is disabled", () => {
			expect({[symb]: true}).to.print(`{
				Symbol(Fancy-Symbol): true
			}`, {ampedSymbols: false});
		});
	});
	
	describe("Visibility", () => {
		it("hides non-enumerable properties by default", () => {
			const value = {
				number: 1024 * 768,
				word: "String",
				object: {},
				list: []
			};
			Object.defineProperty(value, "word", {enumerable: false});
			expect(value).to.print(`{
				list: []
				number: 786432
				object: {}
			}`);
		});
		
		it("doesn't hide an Error's name and message properties", () => {
			expect(new Error("Nope")).to.print(`Error{
				message: "Nope"
				name: "Error"
			}`);
			class CustomError extends Error{}
			expect(new CustomError("Nope")).to.print(`CustomError{
				message: "Nope"
				name: "Error"
			}`);
		});
	});
});
