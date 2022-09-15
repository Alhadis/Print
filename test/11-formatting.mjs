import print           from "../print.mjs";
import {expect}        from "./helpers.mjs";
import {readFileSync}  from "fs";
import {dirname, join} from "path";
import {fileURLToPath} from "url";

const dir  = dirname(fileURLToPath(import.meta.url));
const file = x => readFileSync(join(dir, ...x.split("/")), "utf8");

describe("Formatting", () => {
	describe("Coloured output", () => {
		const off = "\x1B[0m";
		
		it("colours primitives", () => {
			const on = "\x1B[35m";
			expect(true)     .to.print(on + "true"      + off, {colours: true});
			expect(false)    .to.print(on + "false"     + off, {colours: true});
			expect(10.25)    .to.print(on + "10.25"     + off, {colours: true});
			expect(3000n)    .to.print(on + "3000n"     + off, {colours: true});
			expect(Infinity) .to.print(on + "Infinity"  + off, {colours: true});
			expect(-Infinity).to.print(on + "-Infinity" + off, {colours: true});
		});
		
		it("colours nullish values", () => {
			let on = "\x1B[38;5;8m";
			expect(null)     .to.print(on + "null"      + off, {colours: true});
			expect(undefined).to.print(on + "undefined" + off, {colours: true});
			
			on = "\x1B[37m";
			expect(null)     .to.print(on + "null"      + off, {colours: 8});
			expect(undefined).to.print(on + "undefined" + off, {colours: 8});
		});
		
		it("colours strings", () => {
			const input = "Foo Bar \n Baz \t \v Qux";
			const out1  = file("fixtures/string-256.out");
			const out2  = file("fixtures/string-8.out");
			expect(input).to.print(out1, {colours: {}});
			expect(input).to.print(out1, {colours: true});
			expect(input).to.print(out1, {colours: 256});
			expect(input).to.print(out2, {colours: 8});
		});
		
		it("colours property keys", () => {
			const label = "World's loneliest number";
			const out1  = file("fixtures/keys-256.out");
			const out2  = file("fixtures/keys-8.out");
			expect(-0).to.print(out1, label, {colours: {}});
			expect(-0).to.print(out1, label, {colours: true});
			expect(-0).to.print(out1, label, {colours: 256});
			expect(-0).to.print(out2, label, {colours: 8});
		});
		
		it("colours punctuation", () => {
			const obj  = {foo: NaN, bar: [{}, 1, []]};
			const exp1 = file("fixtures/punctuation-256.out");
			const exp2 = file("fixtures/punctuation-8.out");
			expect(print(obj, {colours: {}}))  .to.equal(exp1);
			expect(print(obj, {colours: true})).to.equal(exp1);
			expect(print(obj, {colours: 256})) .to.equal(exp1);
			expect(print(obj, {colours: 8}))   .to.equal(exp2);
		});
		
		it("colours references", () => {
			const a   = {b: "c"};
			const set = new Set([a]);
			set.foo   = {bar: "Baz"};
			set.add(set.foo);
			set[1]    = {nah: "Nope"};
			set.bar   = set[1];
			const map = new Map([
				["A", {}],
				["B", {}],
			]);
			map[0] = {value: {abc: "XYZ"}};
			map["0.value"] = {value: {}};
			map.foo1 = map.get("A");
			map.foo2 = map[0].value;
			map.bar1 = map.get("B");
			map.bar2 = map["0.value"];
			const input = {set, map};
			
			const exp1  = file("fixtures/references-256.out");
			const exp2  = file("fixtures/references-8.out");
			expect(print(input, "input", {colours: {}}))  .to.equal(exp1);
			expect(print(input, "input", {colours: true})).to.equal(exp1);
			expect(print(input, "input", {colours: 256})) .to.equal(exp1);
			expect(print(input, "input", {colours: 8}))   .to.equal(exp2);
		});
		
		it("colours property attributes", () => {
			const input = Object.defineProperties({}, {
				foo: {value: 1, configurable: true,  enumerable: false, writable: true},
				bar: {value: 2, configurable: false, enumerable: true,  writable: true},
				baz: {value: 3, configurable: true,  enumerable: true,  writable: true},
				qux: {get(){ return 1; }, set(){}, configurable: true, enumerable: false},
				qul: {get(){ return 1; }, set(){}, configurable: true, enumerable: true},
			});
			const exp1 = file("fixtures/attributes-256.out");
			const exp2 = file("fixtures/attributes-8.out");
			expect(print(input, "input", {all: true, attr: true, colours: {}}))  .to.equal(exp1);
			expect(print(input, "input", {all: true, attr: true, colours: true})).to.equal(exp1);
			expect(print(input, "input", {all: true, attr: true, colours: 256})) .to.equal(exp1);
			expect(print(input, "input", {all: true, attr: true, colours: 8}))   .to.equal(exp2);
		});
		
		describe("User-defined colours", () => {
			const obj = {foo: "Bar"};
			obj.bar = [{}];
			obj.baz = obj.bar[0];
			obj.qux = new Map([[obj.bar, [{value: {}}]]]);
			obj.qux.set([], obj.qux.get(obj.bar));
			obj.qux.set({}, obj.qux.get(obj.bar)[0]);
			obj.qux.set({}, obj.qux.get(obj.bar)[0].value);
			
			const custom1 = file("fixtures/custom-1.out");
			const custom2 = file("fixtures/custom-2.out");
			const custom3 = file("fixtures/custom-3.out");
			
			it("accepts user-defined colour sequences", () => {
				const colours = {keys: "\x1B[38;5;200m"};
				expect(print(obj, "input", {colours})).to.equal(custom1);
				
				colours.string = "\x1B[38;5;11m";
				colours.quotes = "\x1B[38;5;16m";
				colours.keys   = "\x1B[7m";
				colours.punct  = "\x1B[27m";
				expect(print(obj, "input", {colours})).to.equal(custom2);
			});
			
			it("treats numbers as ANSI colour indexes", () => {
				const colours = {keys: 200};
				expect(print(obj, "input", {colours})).to.equal(custom1);
				colours.string = 11;
				colours.quotes = 16;
				delete colours.keys;
				expect(print(obj, "input", {colours})).to.equal(custom3);
			});
		});
	});

	describe("Indentation", () => {
		it("indents lines using tabs by default", () =>
			expect({foo: 1}).to.print(`{
			\tfoo: 1
			}`));

		it("accepts user-defined indent strings", () =>
			expect({foo: {bar: "baz"}}).to.print(`{
			--->foo: {
			--->--->bar: "baz"
			--->}
			}`, {indent: "--->"}));
		
		it("allows indentation to be stripped entirely", () => {
			for(const indent of ["", null, false])
				expect({foo: {bar: "baz"}}).to.print(`
					{
					foo: {
					bar: "baz"
					}
					}
				`, {indent});
		});
		
		when("`indent` is set to a number", () =>
			it("treats it as the number of spaces to indent by", () => {
				expect({foo: 1}).to.print(`
					{
					    foo: 1
					}
				`, {indent: 4});
				expect({foo: {bar: "baz"}}).to.print(`
					{
					   foo: {
					      bar: "baz"
					   }
					}
				`, {indent: 3});
			}));
	});
});
