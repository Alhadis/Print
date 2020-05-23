import {expect} from "./helpers.mjs";

describe("Primitives", () => {
	it("prints null",      () => expect(null).to.print("null"));
	it("prints undefined", () => expect(undefined).to.print("undefined"));
	
	describe("BigInts", () => {
		it("prints positive integers", () => expect(42n).to.print("42n"));
		it("prints negative integers", () => expect(-42n).to.print("-42n"));
	});
	
	describe("Booleans", () => {
		it("prints true",  () => expect(true).to.print("true"));
		it("prints false", () => expect(false).to.print("false"));
	});
	
	describe("Numbers", () => {
		it("prints positive integers", () => expect(42).to.print("42"));
		it("prints negative integers", () => expect(-42).to.print("-42"));
		it("prints positive floats",   () => expect(4.2).to.print("4.2"));
		it("prints negative floats",   () => expect(-4.2).to.print("-4.2"));
		it("prints positive infinity", () => expect(Infinity).to.print("Infinity"));
		it("prints negative infinity", () => expect(-Infinity).to.print("-Infinity"));
		it("prints positive zero",     () => expect(0).to.print("0"));
		it("prints negative zero",     () => expect(-0).to.print("-0"));
		it("shortens long numbers",    () => expect(1e64).to.print("1e+64"));
		it("prints NaN",               () => expect(NaN).to.print("NaN"));
		
		it("identifies Math.* constants", () => {
			expect(Math.E)      .to.print("Math.E");
			expect(Math.LN10)   .to.print("Math.LN10");
			expect(Math.LN2)    .to.print("Math.LN2");
			expect(Math.LOG10E) .to.print("Math.LOG10E");
			expect(Math.LOG2E)  .to.print("Math.LOG2E");
			expect(Math.PI)     .to.print("Math.PI");
			expect(Math.SQRT1_2).to.print("Math.SQRT1_2");
			expect(Math.SQRT2)  .to.print("Math.SQRT2");
		});
		
		it("identifies Number.* constants", () => {
			expect(Number.EPSILON)          .to.print("Number.EPSILON");
			expect(Number.MIN_VALUE)        .to.print("Number.MIN_VALUE");
			expect(Number.MAX_VALUE)        .to.print("Number.MAX_VALUE");
			expect(Number.MIN_SAFE_INTEGER) .to.print("Number.MIN_SAFE_INTEGER");
			expect(Number.MAX_SAFE_INTEGER) .to.print("Number.MAX_SAFE_INTEGER");
		});
	});
	
	describe("Strings", () => {
		it("prints strings",           () => expect("Foo") .to.print('"Foo"'));
		it("escapes tabs",             () => expect("\t")  .to.print('"\\t"'));
		it("escapes line-feeds",       () => expect("\n")  .to.print('"\\n"'));
		it("escapes form-feeds",       () => expect("\f")  .to.print('"\\f"'));
		it("escapes carriage-returns", () => expect("\r")  .to.print('"\\r"'));
		it("escapes vertical-tabs",    () => expect("\v")  .to.print('"\\v"'));
		it("escapes null-bytes",       () => expect("\0")  .to.print('"\\0"'));
		it("escapes backspaces",       () => expect("\b")  .to.print('"\\b"'));
		it("escapes backslashes",      () => expect("\\")  .to.print('"\\\\"'));
		it("escapes bell characters",  () => expect("\x07").to.print('"\\a"'));
		it("escapes ASCII escapes",    () => expect("\x1B").to.print('"\\e"'));
		it("escapes other controls",   () => {
			const c0 = [1, 2, 3, 4, 5, 6, 28, 29, 30, 31];
			const c1 = new Array(16).fill(0).map((x, i) => i + 128);
			for(let i = 14; i < 27; c0.push(i++));
			for(const code of [...c0, ...c1]){
				const hex = code.toString(16).padStart(2, "0").toUpperCase();
				expect(String.fromCharCode(code)).to.print(`"\\x${hex}"`);
			}
		});
	});
	
	describe("Symbols", () => {
		const desc = Object.getOwnPropertyDescriptor(globalThis, "String");
		afterEach(() => Object.defineProperty(globalThis, "String", desc));
		
		it("prints symbol values", () => {
			const foo = Symbol("Foo");
			expect(foo).to.print("Symbol(Foo)");
		});
		
		it("identifies well-known symbols", () => {
			expect(Symbol.asyncIterator)     .to.print("@@asyncIterator");
			expect(Symbol.hasInstance)       .to.print("@@hasInstance");
			expect(Symbol.isConcatSpreadable).to.print("@@isConcatSpreadable");
			expect(Symbol.iterator)          .to.print("@@iterator");
			expect(Symbol.match)             .to.print("@@match");
			expect(Symbol.replace)           .to.print("@@replace");
			expect(Symbol.search)            .to.print("@@search");
			expect(Symbol.species)           .to.print("@@species");
			expect(Symbol.split)             .to.print("@@split");
			expect(Symbol.toPrimitive)       .to.print("@@toPrimitive");
			expect(Symbol.toStringTag)       .to.print("@@toStringTag");
			expect(Symbol.unscopables)       .to.print("@@unscopables");
		});
		
		it("doesn't identify them if `opts.noAmp` is enabled", () => {
			const {match} = Symbol;
			expect(match).to.print("@@match");
			expect(match).to.print("@@match",              {noAmp: false});
			expect(match).to.print("Symbol(Symbol.match)", {noAmp: true});
		});
		
		it("doesn't confuse them with identically-named symbols", () => {
			expect(Symbol("Symbol.iterator")).to.print("Symbol(Symbol.iterator)");
			expect(Symbol("iterator"))       .to.print("Symbol(iterator)");
			expect(Symbol.iterator)          .to.print("@@iterator");
		});
		
		it("ensures value is always enclosed by `Symbol(…)`", () => {
			Object.defineProperty(globalThis, "String", {
				configurable: true,
				value: input => "symbol" === typeof input
					? input.toString().replace(/^Symbol\(|\)$/g, "")
					: desc.value.call(globalThis, input),
			});
			const sym = Symbol("Foo");
			expect(String(sym)).to.equal("Foo");
			expect(sym).to.print("Symbol(Foo)");
		});
	});
});
