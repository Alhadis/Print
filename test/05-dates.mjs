import {expect} from "./helpers.mjs";

describe("Dates", () => {
	it("prints dates", () => {
		const date = "2000-12-31T18:02:16.555Z";
		expect(new Date(date)).to.print(date);
	});
	
	it("prints properties", () => {
		const date = new Date("2000-10-10T10:02:02.000Z");
		date.foo = "bar";
		date.list = ["Alpha", "Beta", "Delta"];
		expect(date).to.print(`Date {
			2000-10-10T10:02:02.000Z
			
			foo: "bar"
			list: [
				"Alpha"
				"Beta"
				"Delta"
			]
		}`);
	});
	
	it("identifies malformed dates", () => {
		const date = new Date(NaN);
		expect(date).to.print("Invalid Date");
		date.foo = "bar";
		expect(date).to.print(`Date {
			Invalid Date
			
			foo: "bar"
		}`);
	});
	
	it("identifies subclasses", () => {
		class Timestamp extends Date{}
		const date = "2000-12-31T18:02:16.555Z";
		expect(new Timestamp(date)).to.print(`Timestamp {
			${date}
		}`);
		
		class BadDate extends Date{ constructor(){ super(NaN); }}
		const bad8 = new BadDate();
		expect(bad8).to.print(`BadDate {
			Invalid Date
		}`);
		const value = "Yeah, that's bad";
		Object.defineProperty(bad8, "text", {value});
		expect(bad8).to.print(`BadDate {
			Invalid Date
		}`);
		expect(bad8).to.print(`BadDate {
			Invalid Date
			
			text: "${value}"
		}`, {all: true});
	});
});
