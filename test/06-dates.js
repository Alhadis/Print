"use strict";

const {expect} = require("chai");
const print = require("../print.js");

describe("Dates", () => {
	it("prints date values in ISO format", () => {
		const date = new Date("2000-12-31T18:02:16.555Z");
		expect(print(date)).to.match(/^Date{\n\t2000-12-31 18:02:16\.555 GMT\n\t\d+ years ago\n}$/);
	});
	
	it("trims zeroes from the millisecond component", () => {
		const dates = [
			["16.000Z", "16 GMT"],
			["16.120Z", "16.12 GMT"],
			["16.050Z", "16.05 GMT"],
			["16.500Z", "16.5 GMT"]
		];
		for(const [before, after] of dates){
			const date = new Date(`2016-12-31 18:02:${before}`);
			const line = print(date).split(/\n/)[1];
			expect(line).to.equal(`\t2016-12-31 18:02:${after}`);
		}
	});
	
	it("identifies subclasses", () => {
		class ExtendedDate extends Date{}
		const date = new ExtendedDate("2000-12-31T18:02:16.555Z");
		expect(print(date)).to.match(/^ExtendedDate{\n\t2000-12-31 18:02:16\.555 GMT\n\t\d+ years ago\n}$/);
	});
	
	it("identifies malformed dates", () => {
		expect(new Date(NaN)).to.print(`Date{
			Invalid Date
		}`);
		class BadDate extends Date{ constructor(){ super(NaN); }}
		expect(new BadDate()).to.print(`BadDate{
			Invalid Date
		}`);
	});
	
	it("shows named properties", () => {
		let date = new Date("2000-10-10T10:02:02Z");
		date.foo = "bar";
		date.list = ["Alpha", "Beta", "Delta"];
		expect(print(date)).to.match(/^Date{\n\t2000-10-10 10:02:02 GMT\n\t\d+ years ago\n\t\n\tfoo: "bar"\n\tlist: \[\n\t\t"Alpha"\n\t\t"Beta"\n\t\t"Delta"\n\t\]\n}$/);
		
		date = new Date(NaN);
		date.foo = "bar";
		expect(date).to.print(`Date{
			Invalid Date
			
			foo: "bar"
		}`);
	});
	
	describe("Time differences", () => {
		let suffix = "ago";
		let future = false;
		
		const tests = [
			["includes a human-readable time difference", function(){
				const dates = [
					[1500000, "25 minutes"],
					[120000,   "2 minutes"],
					[2000,     "2 seconds"],
					[50000,   "50 seconds"],
					[13680000, "3.8 hours"],
					[388800000, "4.5 days"],
					[10512e6,   "4 months"],
					[126144e6,   "4 years"]
				];
				for(let [offset, diff] of dates){
					if(future) offset = -offset;
					const date = new Date(Date.now() - offset);
					const line = print(date).split(/\n/)[2];
					expect(line).to.equal(`\t${diff} ${suffix}`);
				}
			}],
			
			["rounds differences off to 1 decimal place", function(){
				const dates = [
					[11719800, "3.3 hours"],
					[487296000, "5.6 days"],
					[211620, "3.5 minutes"],
					[13201560, "3.7 hours"]
				];
				for(let [offset, diff] of dates){
					if(future) offset = -offset;
					const date = new Date(Date.now() - offset);
					const line = print(date).split(/\n/)[2];
					expect(line).to.equal(`\t${diff} ${suffix}`);
				}
			}],
			
			["doesn't display fractional seconds", function(){
				const date = new Date(Date.now() - (future ? -2500 : 2500));
				const line = print(date).split(/\n/)[2];
				expect(line).to.equal("\t3 seconds " + suffix);
			}],
			
			["doesn't display fractional intervals longer than a week", function(){
				const dates = [
					[9637138800, "4 months"],
					[1343520000,  "16 days"],
					[1321920000,  "15 days"],
					[725760000,    "8 days"],
					[743040000,    "9 days"],
					[570240000,  "6.6 days"]
				];
				for(let [offset, diff] of dates){
					if(future) offset = -offset;
					const date = new Date(Date.now() - offset);
					const line = print(date).split(/\n/)[2];
					expect(line).to.equal(`\t${diff} ${suffix}`);
				}
			}]
		];
		
		for(const [testName, testHandler] of tests)
			it(testName, testHandler);
		
		suffix = "from now";
		future = true;
		
		it("can read dates in the future", () => {
			for(const [, testHandler] of tests)
				testHandler();
		});
	});
});
