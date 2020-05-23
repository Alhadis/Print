/** @typedef {String|Symbol} Key */

/**
 * Generate a human-readable representation of a value.
 *
 * @param  {*}       value                - Value to inspect
 * @param  {Key}     [key]                - The value's corresponding member name
 * @param  {Object}  [opts]               - Additional settings for refining output
 * @param  {Boolean} [opts.all]           - Display non-enumerable properties
 * @param  {Boolean} [opts.followGetters] - Invoke getter functions
 * @param  {Boolean} [opts.indexes]       - Display the indexes of iterable entries
 * @param  {Boolean} [opts.noAmp]         - Don't identify well-known symbols as `@@…`
 * @param  {Boolean} [opts.noHex]         - Don't format byte-arrays as hexadecimal
 * @param  {Boolean} [opts.sortProps]     - Sort properties alphabetically
 * @param  {WeakMap} [refs=new WeakMap()] - Tracked object references (internal-use only)
 * @param  {String}  [path=""]            - Accessor string used to identify a reference
 * @return {String}
 */
export default function print(value, ...args){
	
	// Resolve arguments
	if(1 === args.length && args[0] && "object" === typeof args[0])
		args.unshift(null);
	
	let [key, opts = {}, refs = new WeakMap(), path = ""] = args;
	let type = typeof value;
	
	// Escape control characters in string output
	const esc = input => {
		input = [...String(input)];
		let result = "";
		const {length} = input;
		for(let ord, chr, i = 0; i < length; ++i)
			switch(chr = input[i]){
				case "\0":   result += "\\0";  break;
				case "\b":   result += "\\b";  break;
				case "\t":   result += "\\t";  break;
				case "\n":   result += "\\n";  break;
				case "\f":   result += "\\f";  break;
				case "\r":   result += "\\r";  break;
				case "\v":   result += "\\v";  break;
				case "\\":   result += "\\\\"; break;
				case "\x07": result += "\\a";  break;
				case "\x1B": result += "\\e";  break;
				default:     result += (ord = chr.charCodeAt(0)) < 256 && !(96 & ord)
					? "\\x" + ord.toString(16).padStart(2, "0").toUpperCase()
					: chr;
			}
		return result;
	};
	
	// Format symbols and property names
	const formatKey = input => {
		if("symbol" === typeof input){
			// Identify well-known symbols using ECMA-262's @@ notation
			if(!opts.noAmp){
				const name = String(input).slice(14, -1);
				if(input === Symbol[name])
					return "@@" + esc(name);
			}
			input = esc(String(input));
			return input.startsWith("Symbol(") && input.endsWith(")")
				? input
				: `Symbol(${input})`;
		}
		return esc(String(input));
	};
	
	// Resolve identifiers
	key  = null != key ? formatKey(key) : "";
	path = path ? (key ? path + "." + key : path) : key || "{root}";
	key += key  ? ": " : "";
	
	// Special primitives that need no introduction
	switch(value){
		case Infinity:
		case -Infinity:
		case null:
		case undefined:
			return key + value;
	}
	
	// Primitive values
	switch(type){
		// Fallback for unrecognised (future) primitive types
		default:
			return key + esc(value);
		
		case "symbol":
			return key + formatKey(value);
		
		case "bigint":
		case "number":
			// Identify special numbers and mathematical constants by name
			for(const global of [Math, Number]){
				const name = global === Math ? "Math" : "Number";
				for(const numKey of Object.getOwnPropertyNames(global)){
					if(numKey !== numKey.toUpperCase())
						continue;
					if(type === typeof global[numKey] && value === global[numKey])
						return `${key}${name}.${numKey}`;
				}
			}
			value = Object.is(value, -0) ? "-0" : String(value);
			if("bigint" === type && !value.endsWith("n")) value += "n";
			return key + value;
		
		case "string":
			return key + `"${esc(value)}"`;
		
		// Dummy entries needed to keep `default` case from matching objects
		case "object":
		case "function":
	}
	
	// Handle circular references
	if(refs.has(value))
		return key + refs.get(value);
	refs.set(value, "-> " + path);
	
	const linesBefore   = [];
	const linesAfter    = [];
	const recurse       = (v, k, p) => print(v, k, opts, refs, p || path);
	const isArrayBuffer = value instanceof ArrayBuffer;
	let isArrayLike     = Symbol.iterator in value && +value.length >= 0;
	let props           = Object.getOwnPropertyNames(value);
	
	// Handle null-prototypes
	type = Object.getPrototypeOf(value);
	if(!type)
		linesBefore.push("Null prototype");
	
	// Resolve type annotation
	else switch(type.constructor){
		case Object:
			// Identify argument lists
			if(isArrayLike && !value[Symbol.toStringTag] && "[object Arguments]" === {}.toString.call(value)){
				type = "Arguments";
				break;
			}
			// Fall-through
		case Array:  type = ""; break;
		default:     type = esc(type.constructor.name);
	}
	
	// Dates
	if(value instanceof Date){
		const str = Date.prototype.toString.call(value);
		linesBefore.push("Invalid Date" === str ? str : Date.prototype.toISOString.call(value));
	}
	
	// Regular expressions
	else if(value instanceof RegExp)
		linesBefore.push(RegExp.prototype.toString.call(value));
	
	// Maps
	else if(value instanceof Map){
		let index = 0;
		for(let [k, v] of value){
			k = recurse(k, null, `${path}[${index}.key]`);
			v = recurse(v, null, `${path}[${index}.value]`);
			k = `${index}.key ${  k.startsWith("-> ") ? "" : "=> "}${k}`;
			v = `${index}.value ${v.startsWith("-> ") ? "" : "=> "}${v}`;
			linesBefore.push(k, v, "");
			++index;
		}
		// Remove trailing blank line
		linesBefore.pop();
	}
	
	// Sets
	else if(value instanceof Set){
		let index = 0;
		for(let v of value){
			v = recurse(v, null, `${path}[${index}]`);
			linesBefore.push(index++ + (v.startsWith("-> ") ? " " : " => ") + v);
		}
	}
	
	// Boxed primitives
	else if(value instanceof Boolean) linesBefore.push(recurse(true.valueOf.call(value)));
	else if(value instanceof Number)  linesBefore.push(recurse(1.  .valueOf.call(value)));
	else if(value instanceof String)  linesBefore.push(recurse(""  .valueOf.call(value))), isArrayLike = false;
	
	// Something that quacks like an array
	else if(isArrayLike || isArrayBuffer){
		const entries = isArrayBuffer ? new Uint8Array(value) : value;
		const {length} = entries;
		
		// Filter out indexed properties, provided they're genuine
		if(!isArrayBuffer)
			props = props.filter(x => +x !== ~~x || +x < 0 || x > length - 1);
		
		// Byte-arrays: format entries in hexadecimal, and arrange in od(1)-like columns
		if(!opts.noHex && entries instanceof Uint8Array)
			for(let i = 0; i < length; i += 16){
				const offset = "│0x" + i.toString(16).padStart(8, "0").toUpperCase() + "│";
				const row = [...entries.subarray(i, i + 16)].map(x => x.toString(16).padStart(2, "0").toUpperCase()).join(" ");
				linesBefore.push(offset + " " + row);
			}
		
		// Otherwise, list contents vertically
		else{
			let lastIndex = -1;
			[].forEach.call(entries, (x, i) => {
				if(lastIndex < i - 1)
					linesBefore.push(`empty × ${i - lastIndex - 1}`);
				linesBefore.push(recurse(x, opts.indexes && !isArrayBuffer ? i : null, `${path}[${i}]`));
				lastIndex = i;
			});
			if(lastIndex < length - 1)
				linesBefore.push(`empty × ${length - lastIndex - 1}`);
		}
	}
	
	// Display the source-code of objects that quack like functions
	if("function" === typeof value){
		const source   = [...Function.prototype.toString.call(value)];
		const lines    = [];
		const {length} = source;
		for(let i = 0, chr, str = ""; i < length;){
			switch(chr = source[i]){
				default: str += chr; break;
				case "\r": "\n" === source[i + 1] && ++i; // Fall-through
				case "\n":
				case "\u2028":
				case "\u2029":
					lines.push(str);
					str = "";
			}
			++i >= length && str && lines.push(str);
		}
		const pad = lines.length.toString().length;
		linesAfter.push(...lines.map((line, index) => {
			const ruler = "│" + (index + 1).toString().padStart(pad, " ") + "│ ";
			return ruler + line;
		}));
	}
	
	// Handle property sorting
	props.push(...Object.getOwnPropertySymbols(value));
	opts.sortProps && props.sort((a, b) =>
		String(a).toLowerCase().localeCompare(String(b).toLowerCase()));
	
	// Inspect each property we're interested in displaying
	const propLines = [];
	for(const prop of props){
		const desc = Object.getOwnPropertyDescriptor(value, prop);
		
		// Skip non-enumerable properties by default
		if(!desc.enumerable && !opts.all)
			continue;
		
		// Getter and/or setter
		if(desc.get || desc.set){
			if(desc.get && opts.followGetters){
				let result;
				try{ result = value[prop]; }
				catch(e){ result = e; }
				propLines.push(recurse(result, prop));
			}
			else{
				if(desc.get) propLines.push(recurse(desc.get, `get ${prop}`));
				if(desc.set) propLines.push(recurse(desc.set, `set ${prop}`));
			}
		}
		else propLines.push(recurse(desc.value, prop));
	}
	
	// Pick an appropriate pair of brackets
	value = isArrayLike
		? ["[", "\n", "]"]
		: ["{", "\n", "}"];
	
	// If there's nothing of interest in a RegExp or Date object, use a 1-line form
	const numProps = propLines.length;
	if(!numProps && ("RegExp" === type || "Date" === type) && 1 === linesBefore.length)
		value = linesBefore, type = "";
	
	// Otherwise, tally our lists and inject padding where it's needed
	else{
		if(linesBefore.length){
			numProps && linesBefore.push("");
			propLines.unshift(...linesBefore);
		}
		if(linesAfter.length){
			numProps && linesAfter.unshift("");
			propLines.push(...linesAfter);
		}
		if(propLines.length)
			for(const prop of propLines)
			for(const line of prop.split("\n"))
				value[1] += `\t${line}\n`;
		else value[1] = "";
	}
	
	return key + (type ? type + " " : "") + value.join("");
}
