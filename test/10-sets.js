"use strict";

const {expect} = require("chai");

const A = {
	colour: 0x00FF00,
	width: 28.52,
	height: 10.2,
	range: [-20, 12],
};

const B = {
	name: "Foo",
	type: "Bar",
	nickname: "Baz",
	cereal: "Quuz",
	age: 30,
};

describe("Sets", () => {
	it("lists basic values", () => {
		const set = new Set(["A", "B", 0xCC]);
		expect(set).to.print(`Set{
			0 => "A"
			1 => "B"
			2 => 204
		}`);
	});
	
	it("lists objects", () => {
		const set = new Set(["0", A, B, "C"]);
		expect(set).to.print(`Set{
			0 => "0"
			1 => {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			2 => {
				age: 30
				cereal: "Quuz"
				name: "Foo"
				nickname: "Baz"
				type: "Bar"
			}
			3 => "C"
		}`);
	});
	
	it("prints empty Sets on one line", () => {
		expect(new Set()).to.print("Set{}");
	});
	
	it("prints empty WeakSets on one line", () => {
		expect(new WeakSet()).to.print("WeakSet{}");
	});
	
	it("prints nested Sets", () => {
		const nest = new Set([1, A, "3", new Set([2, B, "4"])]);
		expect(nest).to.print(`Set{
			0 => 1
			1 => {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			2 => "3"
			3 => Set{
				0 => 2
				1 => {
					age: 30
					cereal: "Quuz"
					name: "Foo"
					nickname: "Baz"
					type: "Bar"
				}
				2 => "4"
			}
		}`);
	});
	
	it("prints named properties in Sets", () => {
		const input = new Set(["A", "B", "C"]);
		input.name = "Quxabaz";
		input.customProperty = {
			foo: "Bar",
			baz: "Quux",
		};
		expect(input).to.print(`Set{
			0 => "A"
			1 => "B"
			2 => "C"
			
			customProperty: {
				baz: "Quux"
				foo: "Bar"
			}
			name: "Quxabaz"
		}`);
	});
	
	it("prints named properties in WeakSets", () => {
		const input = new WeakSet();
		input.A = A;
		input.B = B;
		expect(input).to.print(`WeakSet{
			A: {
				colour: 65280
				height: 10.2
				range: [
					-20
					12
				]
				width: 28.52
			}
			B: {
				age: 30
				cereal: "Quuz"
				name: "Foo"
				nickname: "Baz"
				type: "Bar"
			}
		}`);
	});

	it("only pads named properties in Sets with entries", () => {
		const input = new Set();
		input.name = "Quxabaz";
		expect(input).to.print(`Set{
			name: "Quxabaz"
		}`);
	});
	
	it("indicates references using `->`", () => {
		const bar = {name: "Bar"};
		const input = {foo: "Foo", bar, baz: new Set([bar])};
		expect(input).to.print(`{
			bar: {
				name: "Bar"
			}
			baz: Set{
				0 -> bar
			}
			foo: "Foo"
		}`);
	});
});
