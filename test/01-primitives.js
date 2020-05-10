"use strict";

const {expect} = require("chai");

describe("Primitives", () => {
	it("prints null",      () => expect(null).to.print("null"));
	it("prints undefined", () => expect().to.print("undefined"));
	it("prints true",      () => expect(true).to.print("true"));
	it("prints false",     () => expect(false).to.print("false"));
	it("prints NaN",       () => expect(NaN).to.print("NaN"));
	it("prints objects",   () => expect({}).to.print("{}"));
	it("prints symbols",   () => expect(Symbol("Foo")).to.print("Symbol(Foo)"));
	
	it("isn't fooled by misleading `@@toStringTag` properties", () => {
		for(const type of "String Number Boolean Symbol".split(" "))
			expect({[Symbol.toStringTag]: type}).to.print(`{
				@@Symbol.toStringTag: "${type}"
			}`);
	});
});
