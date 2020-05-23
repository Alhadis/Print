import {expect} from "./helpers.mjs";

describe("Object references", () => {
	it("refers to input using a label", () => {
		const foo = {bar: "Baz"};
		expect(foo).to.print(`foo: {
			bar: "Baz"
		}`, "foo");
	});
	
	it("indicates references using `->`", () => {
		const input = {};
		input.self = input;
		expect(input).to.print(`input: {
			self: -> input
		}`, "input");
		
		input.foo = {};
		input.bar = [];
		input.baz = input.foo;
		expect(input).to.print(`input: {
			self: -> input
			foo: {}
			bar: []
			baz: -> input.foo
		}`, "input");
		input.bar.push(input.baz, input.qux = {});
		expect(input).to.print(`input: {
			self: -> input
			foo: {}
			bar: [
				-> input.foo
				{}
			]
			baz: -> input.foo
			qux: -> input.bar[1]
		}`, "input");
		input.qux = input.bar[1].obj = [];
		expect(input).to.print(`input: {
			self: -> input
			foo: {}
			bar: [
				-> input.foo
				{
					obj: []
				}
			]
			baz: -> input.foo
			qux: -> input.bar[1].obj
		}`, "input");
	});
	
	it("defaults to the label `{root}`", () => {
		const foo = {};
		foo.bar = foo;
		expect(foo).to.print(`{
			bar: -> {root}
		}`);
	});
	
	it("prints symbol-type labels", () => {
		const foo = {bar: "baz"};
		const sym = Symbol("Foo");
		expect(foo).to.print(`Symbol(Foo): {
			bar: "baz"
		}`, sym);
		foo[sym] = foo;
		expect(foo).to.print(`Symbol(Foo): {
			bar: "baz"
			Symbol(Foo): -> Symbol(Foo)
		}`, sym);
		expect(foo).to.print(`@@iterator: {
			bar: "baz"
			Symbol(Foo): -> @@iterator
		}`, Symbol.iterator);
		
		const bar = Symbol("Bar");
		const qux = Symbol("Qux");
		foo[bar] = [{}];
		foo[qux] = foo[bar][0];
		expect(foo).to.print(`input: {
			bar: "baz"
			Symbol(Foo): -> input
			Symbol(Bar): [
				{}
			]
			Symbol(Qux): -> input.Symbol(Bar)[0]
		}`, "input");
		foo[bar][0].qul = {name: "Quul"};
		foo[qux] = foo[bar][0].qul;
		expect(foo).to.print(`Symbol(Foo): {
			bar: "baz"
			Symbol(Foo): -> Symbol(Foo)
			Symbol(Bar): [
				{
					qul: {
						name: "Quul"
					}
				}
			]
			Symbol(Qux): -> Symbol(Foo).Symbol(Bar)[0].qul
		}`, sym);
	});
});
