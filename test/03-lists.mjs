import {expect} from "./helpers.mjs";
import print from "../print.mjs";

describe("Lists", () => {
	describe("Arrays", () => {
		it("prints array entries", () => {
			expect(["Foo"]).to.print(`[
				"Foo"
			]`);
			expect([1, 2]).to.print(`[
				1
				2
			]`);
			expect([{foo: "bar"}]).to.print(`[
				{
					foo: "bar"
				}
			]`);
			expect(["A", {abc: "ABC"}, "Z"]).to.print(`[
				"A"
				{
					abc: "ABC"
				}
				"Z"
			]`);
		});
		
		it("prints assigned properties", () => {
			const array = ["Foo"];
			array.xyz = "XYZ";
			array.abc = "ABC";
			expect(array).to.print(`[
				"Foo"
				
				xyz: "XYZ"
				abc: "ABC"
			]`);
			array.push("Bar");
			expect(array).to.print(`[
				"Foo"
				"Bar"
				
				xyz: "XYZ"
				abc: "ABC"
			]`);
			array[Symbol("XYZ")] = "xyz";
			expect(array).to.print(`[
				"Foo"
				"Bar"
				
				xyz: "XYZ"
				abc: "ABC"
				Symbol(XYZ): "xyz"
			]`);
			array[Symbol("ABC")] = "abc";
			array[2] = 3;
			expect(array).to.print(`[
				"Foo"
				"Bar"
				3
				
				xyz: "XYZ"
				abc: "ABC"
				Symbol(XYZ): "xyz"
				Symbol(ABC): "abc"
			]`);
		});
		
		it("prints empty arrays on one line", () => {
			expect([]).to.print("[]");
			expect([[]]).to.print(`[
				[]
			]`);
			expect([{foo: []}]).to.print(`[
				{
					foo: []
				}
			]`);
			const array = [];
			array.foo = "Bar";
			expect(array).to.print(`[
				foo: "Bar"
			]`);
		});
		
		it("prints holes in sparse arrays", () => {
			expect([1, , 3]).to.print(`[
				1
				empty × 1
				3
			]`);
			expect([1, , , 4]).to.print(`[
				1
				empty × 2
				4
			]`);
			expect([1, , , , 5]).to.print(`[
				1
				empty × 3
				5
			]`);
			expect([1, , , 4, , 6]).to.print(`[
				1
				empty × 2
				4
				empty × 1
				6
			]`);
			expect([1, , , , 5, , , 8]).to.print(`[
				1
				empty × 3
				5
				empty × 2
				8
			]`);
			expect([1, , , , 5, , , 8, , ]).to.print(`[
				1
				empty × 3
				5
				empty × 2
				8
				empty × 1
			]`);
			expect([, , , , 5, , , 8, , ]).to.print(`[
				empty × 4
				5
				empty × 2
				8
				empty × 1
			]`);
			expect([, ]).to.print(`[
				empty × 1
			]`);
			expect([, , ]).to.print(`[
				empty × 2
			]`);
			expect([, , , ]).to.print(`[
				empty × 3
			]`);
			expect([, 2]).to.print(`[
				empty × 1
				2
			]`);
			expect([, , 3]).to.print(`[
				empty × 2
				3
			]`);
			expect([, , , 4]).to.print(`[
				empty × 3
				4
			]`);
			expect([1, , ]).to.print(`[
				1
				empty × 1
			]`);
			expect([1, , , ]).to.print(`[
				1
				empty × 2
			]`);
			expect([1, , , , ]).to.print(`[
				1
				empty × 3
			]`);
			expect([1, , undefined, , 5]).to.print(`[
				1
				empty × 1
				undefined
				empty × 1
				5
			]`);
			let array = [1, , ];
			array.foo = "Foo";
			expect(array).to.print(`[
				1
				empty × 1
				
				foo: "Foo"
			]`);
			array = [, ];
			array.bar = "Bar";
			expect(array).to.print(`[
				empty × 1
				
				bar: "Bar"
			]`);
			array.length = 2;
			expect(array).to.print(`[
				empty × 2
				
				bar: "Bar"
			]`);
			array[1] = 2;
			expect(array).to.print(`[
				empty × 1
				2
				
				bar: "Bar"
			]`);
			array = new Array(40);
			expect(array).to.print(`[
				empty × 40
			]`);
			array[55] = 0;
			expect(array).to.print(`[
				empty × 55
				0
			]`);
		});
		
		it("numbers each element if `opts.indexes` is set", () => {
			expect([1, 2, 3]).to.print(`[
				0: 1
				1: 2
				2: 3
			]`, {indexes: true});
			expect(["1", "Foo", {bar: "Baz"}, []]).to.print(`[
				0: "1"
				1: "Foo"
				2: {
					bar: "Baz"
				}
				3: []
			]`, {indexes: true});
			expect([[1, 2], [3, 4, 5]]).to.print(`[
				0: [
					0: 1
					1: 2
				]
				1: [
					0: 3
					1: 4
					2: 5
				]
			]`, {indexes: true});
			expect([, , , true]).to.print(`[
				empty × 3
				3: true
			]`, {indexes: true});
			const array = [false, , , undefined];
			array.foo = "Bar";
			expect(array).to.print(`[
				0: false
				empty × 2
				3: undefined
				
				foo: "Bar"
			]`, {indexes: true});
		});
	
		it("identifies subclasses", () => {
			class Point extends Array{
				constructor(x, y, z){
					super(x, y, z);
					this.x = x;
					this.y = y;
					this.z = z;
				}
			}
			const pt = new Point(10, 40, 0);
			expect(pt).to.print(`Point [
				10
				40
				0
				
				x: 10
				y: 40
				z: 0
			]`);
			class Void extends Array{}
			class Supervoid extends Void{
				constructor(size, name = ""){
					super(size * size);
					this.name = name;
				}
			}
			expect(new Supervoid(40, "Boötes")).to.print(`Supervoid [
				empty × 1600
				
				name: "Boötes"
			]`);
		});
	});
	
	describe("Typed arrays", () => {
		const bytes = [0xC3, 0x84, 0x00, 0xCB, 0x87, 0x21, 0x0A];
		const range = new Array(255).fill(0).map((x, index) => index);
		const table = `[
			│0x00000000│ 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
			│0x00000010│ 10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F
			│0x00000020│ 20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F
			│0x00000030│ 30 31 32 33 34 35 36 37 38 39 3A 3B 3C 3D 3E 3F
			│0x00000040│ 40 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
			│0x00000050│ 50 51 52 53 54 55 56 57 58 59 5A 5B 5C 5D 5E 5F
			│0x00000060│ 60 61 62 63 64 65 66 67 68 69 6A 6B 6C 6D 6E 6F
			│0x00000070│ 70 71 72 73 74 75 76 77 78 79 7A 7B 7C 7D 7E 7F
			│0x00000080│ 80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F
			│0x00000090│ 90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F
			│0x000000A0│ A0 A1 A2 A3 A4 A5 A6 A7 A8 A9 AA AB AC AD AE AF
			│0x000000B0│ B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF
			│0x000000C0│ C0 C1 C2 C3 C4 C5 C6 C7 C8 C9 CA CB CC CD CE CF
			│0x000000D0│ D0 D1 D2 D3 D4 D5 D6 D7 D8 D9 DA DB DC DD DE DF
			│0x000000E0│ E0 E1 E2 E3 E4 E5 E6 E7 E8 E9 EA EB EC ED EE EF
			│0x000000F0│ F0 F1 F2 F3 F4 F5 F6 F7 F8 F9 FA FB FC FD FE
		]`;
		
		// NB: This technically isn't a typed array, but we format it like one.
		describe("ArrayBuffers", () => {
			it("prints the buffer's contents in hexadecimal", () => {
				expect(Uint8Array.from(range).buffer).to.print(`ArrayBuffer {${table.slice(1, -1)}}`);
				expect(Uint8Array.from(bytes).buffer).to.print(`ArrayBuffer {
					│0x00000000│ C3 84 00 CB 87 21 0A
				}`);
			});
			
			it("doesn't print hexadecimal if `noHex` is enabled", () => {
				expect(Uint8Array.from(bytes).buffer).to.print(`ArrayBuffer {
					195
					132
					0
					203
					135
					33
					10
				}`, {noHex: true});
			});
			
			it("prints assigned properties", () => {
				const {buffer} = Uint8Array.from(bytes);
				buffer.foo = "Foo";
				expect(buffer).to.print(`ArrayBuffer {
					│0x00000000│ C3 84 00 CB 87 21 0A
					
					foo: "Foo"
				}`);
				expect(buffer).to.print(`ArrayBuffer {
					195
					132
					0
					203
					135
					33
					10
					
					foo: "Foo"
				}`, {noHex: true});
				buffer[0] = 1;
				buffer.bar = "Bar";
				buffer[Symbol.split] = "Bytes";
				expect(buffer).to.print(`ArrayBuffer {
					│0x00000000│ C3 84 00 CB 87 21 0A
					
					0: 1
					foo: "Foo"
					bar: "Bar"
					@@split: "Bytes"
				}`);
				expect(buffer).to.print(`ArrayBuffer {
					195
					132
					0
					203
					135
					33
					10
					
					0: 1
					foo: "Foo"
					bar: "Bar"
					@@split: "Bytes"
				}`, {noHex: true});
				buffer[1] = "2";
				buffer[Symbol("ABC")] = "abc";
				expect(buffer).to.print(`ArrayBuffer {
					│0x00000000│ C3 84 00 CB 87 21 0A
					
					0: 1
					1: "2"
					foo: "Foo"
					bar: "Bar"
					@@split: "Bytes"
					Symbol(ABC): "abc"
				}`);
				expect(buffer).to.print(`ArrayBuffer {
					195
					132
					0
					203
					135
					33
					10
					
					0: 1
					1: "2"
					foo: "Foo"
					bar: "Bar"
					@@split: "Bytes"
					Symbol(ABC): "abc"
				}`, {noHex: true});
			});
			
			it("ignores the `indexes` option", () => {
				const {buffer} = Uint8Array.from(bytes);
				const opts = {indexes: true, noHex: true};
				expect(buffer).to.print(`ArrayBuffer {
					195
					132
					0
					203
					135
					33
					10
				}`, opts);
				buffer[0] = 1;
				buffer.foo = "Foo";
				expect(buffer).to.print(`ArrayBuffer {
					195
					132
					0
					203
					135
					33
					10
					
					0: 1
					foo: "Foo"
				}`, opts);
				opts.noHex = false;
				expect(buffer).to.print(`ArrayBuffer {
					│0x00000000│ C3 84 00 CB 87 21 0A
					
					0: 1
					foo: "Foo"
				}`, opts);
			});
			
			it("prints empty buffers on one line", () => {
				const buffer = new ArrayBuffer(0);
				expect(buffer).to.print("ArrayBuffer {}");
				expect(buffer).to.print("ArrayBuffer {}", {noHex: true});
				buffer.foo = "Foo";
				expect(buffer).to.print(`ArrayBuffer {
					foo: "Foo"
				}`);
				expect(buffer).to.print(`ArrayBuffer {
					foo: "Foo"
				}`, {noHex: true});
			});
		});
		
		describe("Uint8Arrays", () => {
			it("prints entries in hexadecimal", () => {
				expect(Uint8Array.from(range)).to.print(`Uint8Array ${table}`);
				expect(Uint8Array.from(bytes)).to.print(`Uint8Array [
					│0x00000000│ C3 84 00 CB 87 21 0A
				]`);
			});
			
			it("doesn't print hexadecimal if `noHex` is enabled", () => {
				expect(Uint8Array.from(bytes)).to.print(`Uint8Array [
					195
					132
					0
					203
					135
					33
					10
				]`, {noHex: true});
			});
			
			it("prints assigned properties", () => {
				const array = Uint8Array.from(bytes);
				array.foo = "Foo";
				expect(array).to.print(`Uint8Array [
					│0x00000000│ C3 84 00 CB 87 21 0A
					
					foo: "Foo"
				]`);
				array[0] = 0;
				array.bar = "Bar";
				array[Symbol.split] = "Bytes";
				expect(array).to.print(`Uint8Array [
					│0x00000000│ 00 84 00 CB 87 21 0A
					
					foo: "Foo"
					bar: "Bar"
					@@split: "Bytes"
				]`);
				array[Symbol("ABC")] = "abc";
				expect(array).to.print(`Uint8Array [
					│0x00000000│ 00 84 00 CB 87 21 0A
					
					foo: "Foo"
					bar: "Bar"
					@@split: "Bytes"
					Symbol(ABC): "abc"
				]`);
			});
			
			it("prints empty arrays on one line", () => {
				const array = new Uint8Array(0);
				expect(array).to.print("Uint8Array []");
				expect(array).to.print("Uint8Array []", {noHex: true});
				array.foo = "Foo";
				expect(array).to.print(`Uint8Array [
					foo: "Foo"
				]`);
				expect(array).to.print(`Uint8Array [
					foo: "Foo"
				]`, {noHex: true});
			});
		});
		
		describe("Others", () => {
			it("prints other typed arrays normally", () => {
				expect(new Float64Array(5)).to.print(`Float64Array [
					0
					0
					0
					0
					0
				]`);
				expect(Float64Array.from([1.2, 3.4, 5.6, -64, -1.5])).to.print(`Float64Array [
					1.2
					3.4
					5.6
					-64
					-1.5
				]`);
				expect(new Uint16Array(5)).to.print(`Uint16Array [
					0
					0
					0
					0
					0
				]`);
				expect(Uint16Array.from([1, 2, 3, 4, 5])).to.print(`Uint16Array [
					1
					2
					3
					4
					5
				]`);
				expect(new BigUint64Array(5)).to.print(`BigUint64Array [
					0n
					0n
					0n
					0n
					0n
				]`);
				expect(BigUint64Array.from([1n, 2n, 3n, 4n, 8n])).to.print(`BigUint64Array [
					1n
					2n
					3n
					4n
					8n
				]`);
				expect(BigInt64Array.from([1n, 2n, 3n, 4n, -6n])).to.print(`BigInt64Array [
					1n
					2n
					3n
					4n
					-6n
				]`);
			});
			
			it("prints assigned properties", () => {
				const floats = Float64Array  .from([1.2, 3.4, 5.6]);
				const uint16 = Uint16Array   .from([1, 20, 30]);
				const uint64 = BigUint64Array.from([1n, 2n, 3n]);
				floats.baz = "Baz";
				uint16.foo = "Foo";
				uint64.bar = "Bar";
				const floatStr = `Float64Array [
					1.2
					3.4
					5.6
					
					baz: "Baz"
				]`;
				const uint16Str = `Uint16Array [
					1
					20
					30
					
					foo: "Foo"
				]`;
				const uint64Str = `BigUint64Array [
					1n
					2n
					3n
					
					bar: "Bar"
				]`;
				expect(floats).to.print(floatStr);
				expect(floats).to.print(floatStr, {noHex: true});
				expect(uint16).to.print(uint16Str);
				expect(uint16).to.print(uint16Str, {noHex: true});
				expect(uint64).to.print(uint64Str);
				expect(uint64).to.print(uint64Str, {noHex: true});
			});
			
			it("prints empty arrays on one line", () => {
				const floats = new Float64Array(0);
				const uint16 = new Uint16Array(0);
				const uint64 = new BigUint64Array(0);
				expect(floats).to.print("Float64Array []");
				expect(floats).to.print("Float64Array []", {noHex: true});
				expect(uint16).to.print("Uint16Array []");
				expect(uint16).to.print("Uint16Array []", {noHex: true});
				expect(uint64).to.print("BigUint64Array []");
				expect(uint64).to.print("BigUint64Array []", {noHex: true});
				floats.baz = "Baz";
				uint16.foo = "Foo";
				uint64.bar = "Bar";
				expect(floats).to.print(`Float64Array [
					baz: "Baz"
				]`);
				expect(floats).to.print(`Float64Array [
					baz: "Baz"
				]`, {noHex: true});
				expect(uint16).to.print(`Uint16Array [
					foo: "Foo"
				]`);
				expect(uint16).to.print(`Uint16Array [
					foo: "Foo"
				]`, {noHex: true});
				expect(uint64).to.print(`BigUint64Array [
					bar: "Bar"
				]`);
				expect(uint64).to.print(`BigUint64Array [
					bar: "Bar"
				]`, {noHex: true});
			});
			
			it("doesn't break when printing `TypedArray.prototype`", () => {
				const output = print(Uint8Array.prototype, {all: true});
				expect(output.split("\n").shift()).to.equal("TypedArray {");
			});
		});
	});
	
	describe("Argument lists", () => {
		it("identifies argument lists", () => {
			const args = (function(){ return arguments; }("A", "B", {a: "C"}));
			expect(args).to.print(`Arguments [
				"A"
				"B"
				{
					a: "C"
				}
			]`);
		});
		
		it("only identifies lists with an obvious [[ParameterMap]]", () => {
			function call(){ throw new TypeError(0xBAAAAAAAAD); }
			const args = Object.defineProperties({0: "A", 1: "B", 2: "C"}, {
				callee:            {get: call, set: call},
				length:            {configurable: true, writable: true, value: 3},
				[Symbol.iterator]: {configurable: true, writable: true, value: Symbol.iterator},
			});
			expect(args).to.print(`[
				"A"
				"B"
				"C"
			]`);
			Object.defineProperty(args, Symbol.toStringTag, {value: "Arguments"});
			expect(args).to.print(`[
				"A"
				"B"
				"C"
			]`);
		});
		
		it("prints empty argument lists on one line", () => {
			const args = (function(){ return arguments; })();
			expect(args).to.print("Arguments []");
		});
		
		it("prints assigned properties", () => {
			let args = (function(){ return arguments; })(1, 2);
			args.foo = "Foo";
			expect(args).to.print(`Arguments [
				1
				2
				
				foo: "Foo"
			]`);
			args[2] = 3;
			args.bar = "Bar";
			expect(args).to.print(`Arguments [
				1
				2
				
				2: 3
				foo: "Foo"
				bar: "Bar"
			]`);
			
			args = (function(){ return arguments; }("A", "B", {a: "C"}));
			args.string = "ABC XYZ";
			expect(args).to.print(`Arguments [
				"A"
				"B"
				{
					a: "C"
				}
				
				string: "ABC XYZ"
			]`);
		});
		
		it("prints holes in sparsely-populated argument lists", () => {
			const args = (function(){ return arguments; })();
			args.length = 6;
			expect(args).to.print(`Arguments [
				empty × 6
			]`);
			args[2] = true;
			expect(args).to.print(`Arguments [
				empty × 2
				true
				empty × 3
			]`);
		});
	});
});
