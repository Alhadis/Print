"use strict";

const print  = require("../print.js");
const Chai   = require("./chai-spice.js");
const {expect} = Chai;


describe("Circular references", () => {
	Chai.detab = 2;
	
	it("Doesn't list an object more than once", () => {
		const A = { name: "A" };
		const B = { name: "B" };
		B.A = A;
		expect({A, B}).to.print(`{
			A: {
				name: "A"
			}
			B: {
				A: -> A
				name: "B"
			}
		}`);
	});
	
	
	it("Refers to original input object as {input}", () => {
		const A = {};
		A.A = A;
		expect(A).to.print(`{
			A: -> {input}
		}`);
	});
	
	
	it('Merges "=> ->" into one arrow for Map references', () => {
		const list = [1];
		const mappedKey = new Map([[list, "list"]]);
		const mappedValue = new Map([["list", list]]);
		expect([list, mappedKey]).to.print(`[
			[
				1
			]
			Map{
				0.key -> [0]
				0.value => "list"
			}
		]`);
		expect([list, mappedValue]).to.print(`[
			[
				1
			]
			Map{
				0.key => "list"
				0.value -> [0]
			}
		]`);
	});
	
	
	it("Displays very complex circular references", () => {
		const zeta = Symbol("Zeta");
		const Z = {
			lowerCase: "z",
			upperCase: "Z"
		};
		const A = {
			gamma: "G",
			beta:  "B",
			alpha: "A",
			overThere: Math.PI,
			[zeta]: Z
		};
		const B = {
			delta: "D",
			epsilon: "E",
			[zeta]: Z,
			alpha: A
		};

		A.omega = B;
		A.self  = A;
		
		expect(A).to.print(`{
			alpha: "A"
			beta: "B"
			gamma: "G"
			omega: {
				alpha: -> {input}
				delta: "D"
				epsilon: "E"
				@@Zeta: {
					lowerCase: "z"
					upperCase: "Z"
				}
			}
			overThere: Math.PI
			self: -> {input}
			@@Zeta: -> omega.@@Zeta
		}`)
	});
});
