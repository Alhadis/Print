import {expect} from "./helpers.mjs";
import print from "../print.mjs";

describe("Property attributes", () => {
	const foo = Symbol("Foo");
	const bar = Symbol("Bar");
	
	it("annotates configurable data properties", () => {
		expect(Object.defineProperties({}, {
			foo: {value: true,  configurable: true},
			bar: {value: false, configurable: false},
		})).to.print(`{
			foo <C>: true
			bar <>: false
		}`, {all: true, attr: true});
		expect(Object.defineProperties({}, {
			[foo]:                       {configurable: true,  value: true},
			[bar]:                       {configurable: false, value: false},
			[Symbol.toStringTag]:        {configurable: true,  value: "XYZ"},
			[Symbol.isConcatSpreadable]: {configurable: false, value: false},
		})).to.print(`{
			Symbol(Foo) <C>: true
			Symbol(Bar) <>: false
			@@toStringTag <C>: "XYZ"
			@@isConcatSpreadable <>: false
		}`, {all: true, attr: true});
	});
	
	it("annotates configurable accessor properties", () => {
		expect(Object.defineProperties({}, {
			foo: {get(){ return 1; }, set(){}, configurable: true},
			bar: {get(){ return 1; }, set(){}, configurable: false},
		})).to.print(`{
			get foo <C>: Function {…}
			set foo <C>: Function {…}
			get bar <>: Function {…}
			set bar <>: Function {…}
		}`, {all: true, attr: true, maxDepth: 1});
		expect(Object.defineProperties({}, {
			[foo]:                       {configurable: true,  set(){}, get(){ return 1; }},
			[bar]:                       {configurable: false, set(){}, get(){ return 1; }},
			[Symbol.toStringTag]:        {configurable: true,  set(){}, get(){ return "XYZ"; }},
			[Symbol.isConcatSpreadable]: {configurable: false, set(){}, get(){ return false; }},
		})).to.print(`{
			get Symbol(Foo) <C>: Function {…}
			set Symbol(Foo) <C>: Function {…}
			get Symbol(Bar) <>: Function {…}
			set Symbol(Bar) <>: Function {…}
			get @@toStringTag <C>: Function {…}
			set @@toStringTag <C>: Function {…}
			get @@isConcatSpreadable <>: Function {…}
			set @@isConcatSpreadable <>: Function {…}
		}`, {all: true, attr: true, maxDepth: 1});
	});
	
	it("annotates enumerable data properties", () => {
		expect(Object.defineProperties({}, {
			foo: {value: true,  enumerable: true},
			bar: {value: false, enumerable: false},
		})).to.print(`{
			foo <E>: true
			bar <>: false
		}`, {all: true, attr: true});
		expect(Object.defineProperties({}, {
			[foo]:                       {enumerable: true,  value: true},
			[bar]:                       {enumerable: false, value: false},
			[Symbol.toStringTag]:        {enumerable: true,  value: "XYZ"},
			[Symbol.isConcatSpreadable]: {enumerable: false, value: false},
		})).to.print(`{
			Symbol(Foo) <E>: true
			Symbol(Bar) <>: false
			@@toStringTag <E>: "XYZ"
			@@isConcatSpreadable <>: false
		}`, {all: true, attr: true});
	});
	
	it("annotates enumerable accessor properties", () => {
		expect(Object.defineProperties({}, {
			foo: {get(){ return 1; }, set(){}, enumerable: true},
			bar: {get(){ return 1; }, set(){}, enumerable: false},
		})).to.print(`{
			get foo <E>: Function {…}
			set foo <E>: Function {…}
			get bar <>: Function {…}
			set bar <>: Function {…}
		}`, {all: true, attr: true, maxDepth: 1});
		expect(Object.defineProperties({}, {
			[foo]:                       {enumerable: true,  set(){}, get(){ return 1; }},
			[bar]:                       {enumerable: false, set(){}, get(){ return 1; }},
			[Symbol.toStringTag]:        {enumerable: true,  set(){}, get(){ return "XYZ"; }},
			[Symbol.isConcatSpreadable]: {enumerable: false, set(){}, get(){ return false; }},
		})).to.print(`{
			get Symbol(Foo) <E>: Function {…}
			set Symbol(Foo) <E>: Function {…}
			get Symbol(Bar) <>: Function {…}
			set Symbol(Bar) <>: Function {…}
			get @@toStringTag <E>: Function {…}
			set @@toStringTag <E>: Function {…}
			get @@isConcatSpreadable <>: Function {…}
			set @@isConcatSpreadable <>: Function {…}
		}`, {all: true, attr: true, maxDepth: 1});
	});
	
	it("annotates writable data properties", () => {
		expect(Object.defineProperties({}, {
			foo: {value: true,  writable: true},
			bar: {value: false, writable: false},
		})).to.print(`{
			foo <W>: true
			bar <>: false
		}`, {all: true, attr: true});
		expect(Object.defineProperties({}, {
			[foo]:                       {writable: true,  value: true},
			[bar]:                       {writable: false, value: false},
			[Symbol.toStringTag]:        {writable: true,  value: "XYZ"},
			[Symbol.isConcatSpreadable]: {writable: false, value: false},
		})).to.print(`{
			Symbol(Foo) <W>: true
			Symbol(Bar) <>: false
			@@toStringTag <W>: "XYZ"
			@@isConcatSpreadable <>: false
		}`, {all: true, attr: true});
	});
	
	it("lists annotations in alphabetical order", () => {
		const obj = Object.defineProperties({}, {
			foo: {configurable: true,  enumerable: false, writable: true, value: Number.MAX_VALUE},
			bar: {configurable: false, enumerable: true,  writable: true, value: 2},
			baz: {configurable: true,  enumerable: true,  writable: true, value: Math.PI},
		});
		expect(obj).to.print(`{
			foo <C,W>: Number.MAX_VALUE
			bar <E,W>: 2
			baz <C,E,W>: Math.PI
		}`, {all: true, attr: true});
		obj.bar = Object.defineProperties({}, {
			abc: {value: "ABC"},
			max: {configurable: true, enumerable: true,  writable: true,  value: Number.MAX_VALUE},
			min: {configurable: true, enumerable: false, writable: false, value: Number.MIN_VALUE},
			xyz: {value: "XYZ"},
		});
		expect(obj).to.print(`{
			foo <C,W>: Number.MAX_VALUE
			bar <E,W>: {
				abc <>: "ABC"
				max <C,E,W>: Number.MAX_VALUE
				min <C>: Number.MIN_VALUE
				xyz <>: "XYZ"
			}
			baz <C,E,W>: Math.PI
		}`, {all: true, attr: true});
	});
	
	it("annotates array indexes", () => {
		expect("ABC".split("")).to.print(`[
			0 <C,E,W>: "A"
			1 <C,E,W>: "B"
			2 <C,E,W>: "C"
		]`, {attr: true, indexes: true});
		expect("ABC".split("")).to.print(`[
			"A"
			"B"
			"C"
			
			length <W>: 3
		]`, {all: true, attr: true});
		
		const input = Object.defineProperties("ABCD".split(""), {
			0:   {configurable: true,  enumerable: false, writable: true},
			1:   {configurable: false, enumerable: true,  writable: true},
			3:   {configurable: false, enumerable: false, writable: false},
			sum: {configurable: false, enumerable: true,  writable: false, value: 3},
		});
		expect(input).to.print(`[
			0 <C,W>: "A"
			1 <E,W>: "B"
			2 <C,E,W>: "C"
			3 <>: "D"
			
			length <W>: 4
			sum <E>: 3
		]`, {all: true, attr: true, indexes: true});
		expect(input).to.print(`[
			"A"
			"B"
			"C"
			"D"
			
			length <W>: 4
			sum <E>: 3
		]`, {all: true, attr: true});
	});
	
	it("annotates input label for consistency", () => {
		expect(print({}, "input", {all: true, attr: true})).to.equal("input <>: {}");
		expect(print(45, "input", {all: true, attr: true})).to.equal("input <>: 45");
	});
	
	it("never includes annotations in references", () => {
		const baz = {};
		const foo = {
			self: null,
			foo: baz,
			bar: {baz},
			qux: true,
		};
		foo.self = foo;
		Object.defineProperty(foo,     "self", {writable: false});
		Object.defineProperty(foo.bar, "baz",  {writable: false, configurable: false});
		expect(foo).to.print(`input <>: {
			self <C,E>: -> input
			foo <C,E,W>: {}
			bar <C,E,W>: {
				baz <E>: -> input.foo
			}
			qux <C,E,W>: true
		}`, "input", {attr: true});
	});
});
