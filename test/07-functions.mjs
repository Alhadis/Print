import {expect} from "./helpers.mjs";

describe("Functions", () => {
	it("prints source code", () => {
		function func(i){ return i + 2; }
		expect(func).to.print(`Function {
			│1│ function func(i){ return i + 2; }
		}`);
		expect(() => "A").to.print(`Function {
			│1│ () => "A"
		}`);
		const obj = {
			func: function fn(value){ return value; },
			arrow: (a, b) => a + b,
		};
		expect(obj).to.print(`{
			func: Function {
				│1│ function fn(value){ return value; }
			}
			arrow: Function {
				│1│ (a, b) => a + b
			}
		}`);
	});
	
	it("identifies generator functions", () => {
		function* foo(){ yield 20; }
		expect(foo).to.print(`GeneratorFunction {
			│1│ function* foo(){ yield 20; }
		}`);
		expect({method: foo}).to.print(`{
			method: GeneratorFunction {
				│1│ function* foo(){ yield 20; }
			}
		}`);
	});
	
	it("identifies asynchronous functions", () => {
		async function foo(){ return 20; }
		expect(foo).to.print(`AsyncFunction {
			│1│ async function foo(){ return 20; }
		}`);
		expect({method: foo}).to.print(`{
			method: AsyncFunction {
				│1│ async function foo(){ return 20; }
			}
		}`);
	});
	
	it("identifies asynchronous generators", () => {
		async function* foo(){ yield 20; }
		expect(foo).to.print(`AsyncGeneratorFunction {
			│1│ async function* foo(){ yield 20; }
		}`);
		expect({method: foo}).to.print(`{
			method: AsyncGeneratorFunction {
				│1│ async function* foo(){ yield 20; }
			}
		}`);
	});
	
	it("prints properties", () => {
		function foo(a, b){ return a + b; }
		expect(foo).to.print(`Function {
			length: 2
			name: "foo"
			prototype: {
				constructor: -> {root}
			}
			
			│1│ function foo(a, b){ return a + b; }
		}`, {all: true});
		foo.bar = "Bar";
		expect(foo).to.print(`Function {
			length: 2
			name: "foo"
			prototype: {
				constructor: -> {root}
			}
			bar: "Bar"
			
			│1│ function foo(a, b){ return a + b; }
		}`, {all: true});
	});
	
	it("doesn't print source code if `noSource` is set", () => {
		function foo(i){ return i + 1; }
		function *bar(){ yield true; }
		async function baz(i){ return i + 2; }
		async function *qux(){ yield true; }
		const opts = {noSource: true};
		expect(foo).to.print("Function {}", opts);
		expect(bar).to.print("GeneratorFunction {}", opts);
		expect(baz).to.print("AsyncFunction {}", opts);
		expect(qux).to.print("AsyncGeneratorFunction {}", opts);
		
		opts.all = true;
		expect(foo).to.print(`Function {
			length: 1
			name: "foo"
			prototype: {
				constructor: -> {root}
			}
		}`, opts);
		expect(bar).to.print(`GeneratorFunction {
			length: 0
			name: "bar"
			prototype: {}
		}`, opts);
		expect(baz).to.print(`AsyncFunction {
			length: 1
			name: "baz"
		}`, opts);
		expect(qux).to.print(`AsyncGeneratorFunction {
			length: 0
			name: "qux"
			prototype: {}
		}`, opts);
	});
	
	describe("Accessors", () => {
		it("prints getter/setter pairs", () => {
			let calls = 0;
			expect({
				abc: "ABC",
				get foo(){ return "Foo"; },
				set foo(to){ calls += 1 ** +!!to; },
				xyz: "XYZ",
			}).to.print(`{
				abc: "ABC"
				get foo: Function {
					│1│ get foo(){ return "Foo"; }
				}
				set foo: Function {
					│1│ set foo(to){ calls += 1 ** +!!to; }
				}
				xyz: "XYZ"
			}`);
			expect(calls).to.equal(0);
			
			calls = 0;
			expect({
				abc: "ABC",
				get [Symbol.toStringTag](){ ++calls; return "Bar"; },
				set [Symbol.toStringTag](to){ calls += 1 ** +!!to; },
				xyz: "XYZ",
			}).to.print(`{
				abc: "ABC"
				xyz: "XYZ"
				get @@toStringTag: Function {
					│1│ get [Symbol.toStringTag](){ ++calls; return "Bar"; }
				}
				set @@toStringTag: Function {
					│1│ set [Symbol.toStringTag](to){ calls += 1 ** +!!to; }
				}
			}`);
			expect(calls).to.equal(0);
		});
		
		it("doesn't print them when invoking getters", () => {
			let getterCalls = 0;
			let setterCalls = 0;
			expect({
				abc: "ABC",
				get foo(){ return ++getterCalls; },
				set foo(to){ setterCalls += 1 ** +!!to; },
				xyz: "XYZ",
			}).to.print(`{
				abc: "ABC"
				foo: 1
				xyz: "XYZ"
			}`, {followGetters: true});
			expect(getterCalls).to.equal(1);
			expect(setterCalls).to.equal(0);
		});
		
		it("always prints write-only accessors", () => {
			const obj = {
				foo: "Foo",
				set name(to){ obj.foo = to; },
				bar: "Bar",
			};
			expect(obj).to.print(`{
				foo: "Foo"
				set name: Function {
					│1│ set name(to){ obj.foo = to; }
				}
				bar: "Bar"
			}`, {followGetters: true});
		});
		
		it("identifies references", () => {
			function bar(a, b){ return a + b; }
			const obj = Object.defineProperty({a: 1, b: 2}, "foo", {
				enumerable: true,
				get: bar,
				set: bar,
			});
			expect(obj).to.print(`{
				a: 1
				b: 2
				get foo: Function {
					│1│ function bar(a, b){ return a + b; }
				}
				set foo: -> {root}.get foo
			}`);
			bar.baz = "Qux";
			obj.c = 3;
			expect(obj).to.print(`{
				a: 1
				b: 2
				get foo: Function {
					baz: "Qux"
					
					│1│ function bar(a, b){ return a + b; }
				}
				set foo: -> {root}.get foo
				c: 3
			}`);
		});
	});
	
	describe("Line terminators", () => {
		const lines = [
			"function foo(c){",
			"\tlet a = 1;",
			"\tlet b = 2;",
			"\tif(a + b < c)",
			"\t\treturn a + b;",
			"}",
		];
		const output = `Function {
			│1│ ${lines[0]}
			│2│ ${lines[1]}
			│3│ ${lines[2]}
			│4│ ${lines[3]}
			│5│ ${lines[4]}
			│6│ ${lines[5]}
		}`;
		const fn = eol => expect(Function("return " + lines.join(eol))()).to.print(output);
		it("prints source code that uses LF endings",   () => fn("\n"));
		it("prints source code that uses CR endings",   () => fn("\r"));
		it("prints source code that uses CRLF endings", () => fn("\r\n"));
		it("prints source code that uses LS endings",   () => fn("\u2028"));
		it("prints source code that uses PS endings",   () => fn("\u2029"));
		it("prints source code with mixed endings",     () => {
			const eol = ["\n", "\r", "\r\n", "\u2028", "\u2029"];
			for(let i = 0; i < 5; ++i){
				const src = lines.map((line, index) => line + eol[(i + index) % 5]).join("");
				expect(Function("return " + src)()).to.print(output);
			}
		});
	});
});
