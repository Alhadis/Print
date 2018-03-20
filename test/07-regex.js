"use strict";

const fs       = require("fs");
const {expect} = require("chai");

describe("Regular expressions", () => {
	it("prints simple regex",   () => expect(/a/).to.print("/a/"));
	it("prints flags",          () => expect(/a/i).to.print("/a/i"));
	it("prints multiple flags", () => expect(/a/gmi).to.print("/a/gim"));
	
	it("prints hairy regex", () => {
		let exp = require.resolve("./fixtures/hairy-regex.js");
		let src = fs.readFileSync(exp).toString().replace(/^(?!\t).+\n?$|^\t+|,$/gm, "").split(/\n/g).filter(Boolean);
		exp = require(exp);
		src.forEach((str, index) => expect(exp[index]).to.print(str));
	});
	
	it("displays value of .lastIndex if non-zero", () => {
		const value = /abc|xyz/g;
		expect(value).to.print("/abc|xyz/g");
		value.exec("< xyz >");
		expect(value).to.print(`RegExp{
			/abc|xyz/g
			
			lastIndex: 5
		}`);
		value.lastIndex = false;
		expect(value).to.print(`RegExp{
			/abc|xyz/g
			
			lastIndex: false
		}`);
	});
	
	it("displays named properties", () => {
		const value = /abc|xyz/gi;
		value.foo = "Foo";
		expect(value).to.print(`RegExp{
			/abc|xyz/gi
			
			foo: "Foo"
		}`);
		value.bar = "Bar";
		expect(value).to.print(`RegExp{
			/abc|xyz/gi
			
			bar: "Bar"
			foo: "Foo"
		}`);
	});
	
	it("displays both named properties and non-zero .lastIndex", () => {
		const value = /abc|xyz/gi;
		value.foo = "Foo";
		value.exec("< xyz >");
		expect(value).to.print(`RegExp{
			/abc|xyz/gi
			
			foo: "Foo"
			lastIndex: 5
		}`);
		value.zzz = "Sleepy";
		value.lastIndex = null;
		expect(value).to.print(`RegExp{
			/abc|xyz/gi
			
			foo: "Foo"
			lastIndex: null
			zzz: "Sleepy"
		}`);
	});
	
	it("identifies subclasses", () => {
		class PCRE extends RegExp{
			constructor(...args){
				super(...args);
			}
		}
		const regex = new PCRE("ABC|XYZ", "gi");
		expect(regex).to.print(`PCRE{
			/ABC|XYZ/gi
		}`);
		regex.foo = "Foo";
		expect(regex).to.print(`PCRE{
			/ABC|XYZ/gi
			
			foo: "Foo"
		}`);
		regex.exec("ABC");
		expect(regex).to.print(`PCRE{
			/ABC|XYZ/gi
			
			foo: "Foo"
			lastIndex: 3
		}`);
	});
});
