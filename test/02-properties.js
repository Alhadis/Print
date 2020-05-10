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
				__FB:  "FooBar",
			},
			{
				ZZZZ: 0,
				aaaa: 1,
				AaAA: 2,
				bbBB: 3,
			},
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
		
		it("alphabetises Symbol-keyed properties", () => {
			const foo = Symbol("FOO");
			const bar = Symbol("BAR");
			const baz = Symbol("BAZ");
			expect({[foo]: 1, [bar]: 2, [baz]: 3}).to.print(`{
				@@BAR: 2
				@@BAZ: 3
				@@FOO: 1
			}`);
			expect({[foo]: 1, [bar]: 2, [baz]: 3}).to.print(`{
				@@FOO: 1
				@@BAR: 2
				@@BAZ: 3
			}`, {sortProps: false});
		});
	});
	
	describe("Visibility", () => {
		it("hides non-enumerables by default", () => {
			const value = {
				number: 1024 * 768,
				word: "String",
				object: {},
				list: [],
			};
			Object.defineProperty(value, "word", {enumerable: false});
			expect(value).to.print(`{
				list: []
				number: 786432
				object: {}
			}`);
		});
		
		it("shows non-enumerables if `showAll` is enabled", () => {
			expect(Object.create(null, {
				word: {
					value: "String",
					enumerable: false,
				},
				length: {
					value: 1024 * 768,
					enumerable: true,
				},
			})).to.print(`{
				length: 786432
				word: "String"
			}`, {showAll: true});
		});
		
		it("always shows an Error's name and message", () => {
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
		
		it("shows lengths only when `showArrayLength` is set", () => {
			expect([]).to.print("[]", {showAll: true});
			expect([]).to.print(`[
				length: 0
			]`, {
				showAll: true,
				showArrayLength: true,
			});
			expect(["A", "B", "C"]).to.print(`[
				"A"
				"B"
				"C"
			]`, {showAll: true});
			expect(["A", "B", "C"]).to.print(`[
				"A"
				"B"
				"C"
				length: 3
			]`, {
				showAll: true,
				showArrayLength: true,
			});
		});
		
		it("never shows inherited properties", () => {
			const descriptors = {
				foo: {value: "Foo", writable: true, enumerable: true},
				bar: {value: "Bar", writable: true, enumerable: false},
			};
			class Thing{ method(){} }
			Object.defineProperties(Thing.prototype, descriptors);
			const value = new Thing();
			expect(value).to.print("Thing{}");
			expect(value).to.print("Thing{}", {showAll: true});
			Object.defineProperties(value, descriptors);
			expect(value).to.print(`Thing{
				foo: "Foo"
			}`);
			expect(value).to.print(`Thing{
				bar: "Bar"
				foo: "Foo"
			}`, {showAll: true});
		});
	});
	
	describe("Getters", () => {
		it("avoids triggering property getters by default", () => {
			let called = false;
			expect({
				foo: "Foo",
				get bar(){
					called = true;
					return "Bar";
				},
				baz: "Baz",
			}).to.print(`{
				baz: "Baz"
				foo: "Foo"
			}`);
			expect(called).to.be.false;
			
			class Thing{
				get bar(){
					called = true;
					return "Bar";
				}
			}
			expect(new Thing()).to.print("Thing{}");
			expect(called).to.be.false;
		});
		
		it("triggers getters if `invokeGetters` is enabled", () => {
			let called = false;
			expect({
				foo: "Foo",
				get bar(){
					called = true;
					return "Bar";
				},
				baz: "Baz",
			}).to.print(`{
				bar: "Bar"
				baz: "Baz"
				foo: "Foo"
			}`, {invokeGetters: true});
			expect(called).to.be.true;
		});
		
		it("triggers them only once", () => {
			let callCount = 0;
			expect({
				get foo(){
					return ++callCount;
				},
			}).to.print(`{
				foo: 1
			}`, {invokeGetters: true});
			expect(callCount).to.equal(1);
		});
		
		it("doesn't display write-only properties", () => {
			let called = false;
			expect(Object.create(null, {
				foo: {
					value: "Foo",
					enumerable: true,
				},
				bar: {
					set(i){ called = true; +i; },
					enumerable: true,
				},
				baz: {
					set(i){ called = true; +i; },
					enumerable: false,
				},
			})).to.print(`{
				foo: "Foo"
			}`, {invokeGetters: true});
			expect(called).to.be.false;
		});
	});
});
