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
 * @param  {Number}  [opts.maxDepth]      - Hide object details after 𝑁 recursions
 * @param  {Boolean} [opts.noAmp]         - Don't identify well-known symbols as `@@…`
 * @param  {Boolean} [opts.noHex]         - Don't format byte-arrays as hexadecimal
 * @param  {Boolean} [opts.noSource]      - Don't display function source code
 * @param  {Boolean} [opts.proto]         - Show `__proto__` properties if possible
 * @param  {Boolean} [opts.sort]          - Sort properties alphabetically
 * @param  {WeakMap} [refs=new WeakMap()] - Tracked object references (internal-use only)
 * @param  {String}  [path=""]            - Accessor string used to identify a reference
 * @param  {Number}  [depth=0]            - Current recursion level
 * @param  {Number}  [flags=0]            - Bitmask of flags used internally
 * @return {String}
 */
export default function print(value, ...args){
	
	// Resolve arguments
	if(1 === args.length && args[0] && "object" === typeof args[0])
		args.unshift(null);
	
	let [key, opts = {}, refs = new WeakMap(), path = "", depth = 0, flags = 0] = args;
	let type = typeof value;
	++depth;
	
	// Escape control characters in string output
	const esc = (input, prevColour = off, escColour = escape) => {
		input = [...String(input)];
		let result = "";
		const {length} = input;
		for(let ord, chr, i = 0; i < length; ++i)
			switch(chr = input[i]){
				case "\0":   result += escColour + "\\0"  + prevColour; break;
				case "\b":   result += escColour + "\\b"  + prevColour; break;
				case "\t":   result += escColour + "\\t"  + prevColour; break;
				case "\n":   result += escColour + "\\n"  + prevColour; break;
				case "\f":   result += escColour + "\\f"  + prevColour; break;
				case "\r":   result += escColour + "\\r"  + prevColour; break;
				case "\v":   result += escColour + "\\v"  + prevColour; break;
				case "\\":   result += escColour + "\\\\" + prevColour; break;
				case "\x07": result += escColour + "\\a"  + prevColour; break;
				case "\x1B": result += escColour + "\\e"  + prevColour; break;
				default:     result += (ord = chr.charCodeAt(0)) < 256 && !(96 & ord)
					? escColour + "\\x" + ord.toString(16).padStart(2, "0").toUpperCase() + prevColour
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
					return symbolFade + "@@" + symbol + esc(name, symbol) + off;
			}
			input = esc(input, symbol);
			input = input.startsWith("Symbol(") && input.endsWith(")") ? input.slice(7, -1) : input;
			return `${symbol}Symbol${symbolFade}(${symbol + input + symbolFade})${off}`;
		}
		return keys + esc(input, keys, keyEscape) + off;
	};
	
	// Resolve decorator characters
	let {
		arrowFat   = "=>",
		arrowThin  = "->",
		braceLeft  = "[",
		braceRight = "]",
		border     = "│",
		ellipsis   = "…",
		quote      = '"',
		quoteLeft  = quote,
		quoteRight = quote,
		times      = "×",
	} = opts.chars || {};
	
	// Resolve colour table
	let {colours} = opts, colourMode = 1;
	switch(colours){
		case true:
		case 256:
			colourMode = 2;
			// Fall-through
		case 8:
			colours = {};
			break;
		default:
			colourMode = colours && "object" === typeof colours ? 2 : 0;
	}
	colours = {__proto__: null, ...colours};
	for(const key in colours)
		if("number" === typeof colours[key])
			colours[key] = "\x1B[38;5;" + colours[key] + "m";
	const {
		off        = ["", "\x1B[0m",  "\x1B[0m"]       [colourMode],
		red        = ["", "\x1B[31m", "\x1B[38;5;9m"]  [colourMode],
		grey       = ["", "\x1B[37m", "\x1B[38;5;8m"]  [colourMode],
		green      = ["", "\x1B[32m", "\x1B[38;5;10m"] [colourMode],
		darkGreen  = ["", green,      "\x1B[38;5;22m"] [colourMode],
		punct      = ["", grey,       "\x1B[38;5;237m"][colourMode],
		keys       = ["", "\x1B[39m", "\x1B[39m"]      [colourMode],
		keyEscape  = ["", red,        "\x1B[38;5;124m"][colourMode],
		typeColour = ["", "\x1B[1m",  "\x1B[1m"]       [colourMode],
		primitive  = ["", "\x1B[35m", "\x1B[35m"]      [colourMode],
		escape     = ["", "\x1B[32m", "\x1B[38;5;28m"] [colourMode],
		date       = ["", "\x1B[33m", "\x1B[38;5;130m"][colourMode],
		hexBorder  = ["", red,        "\x1B[38;5;88m"] [colourMode],
		hexValue   = red,
		hexOffset  = red,
		reference  = red,
		srcBorder  = darkGreen,
		srcRowNum  = green,
		srcRowText = darkGreen,
		nul        = grey,
		nulProt    = grey,
		undef      = grey,
		noExts     = grey,
		frozen     = noExts,
		sealed     = noExts,
		regex      = green,
		string     = green,
		symbol     = green,
		symbolFade = darkGreen,
		braces     = punct,
		quotes     = darkGreen,
		empty      = grey + "empty " + times + " ",
		dot        = punct + ".",
	} = colours;
	braceLeft  = braces    + braceLeft  + off;
	braceRight = braces    + braceRight + off;
	quoteLeft  = quotes    + quoteLeft  + string;
	quoteRight = quotes    + quoteRight + off;
	ellipsis   = punct     + ellipsis   + off;
	arrowFat   = punct     + arrowFat   + off + " ";
	arrowThin  = reference + arrowThin  + off + " ";
	
	// Resolve identifiers
	key  = null != key ? flags & 1 ? key : formatKey(key) : "";
	path = path ? (key ? path + dot + keys + key : path) : key || "{root}";
	key += key  ? punct + ":" + off + " " : "";
	
	// Special primitives that need no introduction
	switch(value){
		case true:
		case false:
		case Infinity:
		case -Infinity:
			return key + primitive + value + off;
		case null:
			return key + nul + value + off;
		case undefined:
			return key + undef + value + off;
	}
	
	// Primitive values
	switch(type){
		default:
			return key + formatKey(value);
		
		case "bigint":
		case "number":
			// Identify special numbers and mathematical constants by name
			for(const global of [Math, Number]){
				const [name, skip] = global === Math
					? ["Math",   flags & 4]
					: ["Number", flags & 2];
				if(skip) continue;
				for(const numKey of Object.getOwnPropertyNames(global)){
					if(numKey !== numKey.toUpperCase())
						continue;
					if(type === typeof global[numKey] && value === global[numKey])
						return key + primitive + name + "." + primitive + numKey + off;
				}
			}
			value = Object.is(value, -0) ? "-0" : String(value);
			if("bigint" === type && !value.endsWith("n")) value += "n";
			return key + primitive + value + off;
		
		case "string":
			return key + quoteLeft + esc(value, string) + quoteRight;
		
		// Dummy entries needed to keep `default` case from matching objects
		case "object":
		case "function":
			break;
	}
	
	// Handle circular references
	if(refs.has(value))
		return key + refs.get(value);
	refs.set(value, arrowThin + keys + path);
	
	const linesBefore   = [];
	const linesAfter    = [];
	const propLines     = [];
	const tooDeep       = depth > opts.maxDepth && isFinite(opts.maxDepth);
	const isArrayBuffer = value instanceof ArrayBuffer || "function" === typeof SharedArrayBuffer && value instanceof SharedArrayBuffer;
	let isArrayLike     = false;
	let props           = tooDeep || Object.getOwnPropertyNames(value);
	
	// Ignore gripes from `TypedArray.prototype.length`
	try{ isArrayLike = Symbol.iterator in value && +value.length >= 0; }
	catch(e){}
	
	// Handle null-prototypes
	type = Object.getPrototypeOf(value);
	if(!type)
		tooDeep || linesBefore.push(nulProt + "Null prototype" + off);
	
	// Resolve type annotation
	else switch(type.constructor){
		case Object:
			// Identify argument lists
			if(isArrayLike && !value[Symbol.toStringTag] && "[object Arguments]" === {}.toString.call(value)){
				type = "Arguments";
				break;
			}
			// Fall-through
		case null:
		case undefined:
		case Array:  type = ""; break;
		default:     type = esc(type.constructor.name);
	}
	
	if(!tooDeep){
		if(Object.isFrozen(value))           linesBefore.push(frozen + "Frozen" + off);
		else if(Object.isSealed(value))      linesBefore.push(sealed + "Sealed" + off);
		else if(!Object.isExtensible(value)) linesBefore.push(noExts + "Non-extensible" + off);
	}
	
	// Dates
	if(value instanceof Date){
		const str = Date.prototype.toString.call(value);
		linesBefore.push(date + ("Invalid Date" === str ? str : Date.prototype.toISOString.call(value)) + off);
	}
	
	// Regular expressions
	else if(value instanceof RegExp)
		linesBefore.push(regex + RegExp.prototype.toString.call(value) + off);
	
	// Something without a single-line representation that's beyond our recursion limit
	else if(tooDeep)
		linesBefore.push(ellipsis);
	
	// Maps
	else if(value instanceof Map){
		let index = 0, p;
		try{
			for(let [k, v] of value){
				p = path + braceLeft + keys + index + dot + keys;
				k = print(k, null, opts, refs, p + "key"   + braceRight, depth);
				v = print(v, null, opts, refs, p + "value" + braceRight, depth);
				k = keys + index + dot + keys + "key "   + (k.startsWith(arrowThin) ? "" : arrowFat) + k;
				v = keys + index + dot + keys + "value " + (v.startsWith(arrowThin) ? "" : arrowFat) + v;
				linesBefore.push(k, v, "");
				++index;
			}
			// Remove trailing blank line
			linesBefore.pop();
		}
		catch(e){ linesBefore.push(print(e, null, opts, refs, path, depth)); }
	}
	
	// Sets
	else if(value instanceof Set){
		let index = 0;
		try{
			for(let v of value){
				v = print(v, null, opts, refs, path + braceLeft + keys + index + braceRight, depth);
				linesBefore.push(index++ + " " + (v.startsWith(arrowThin) ? "" : arrowFat) + v);
			}
		}
		catch(e){ linesBefore.push(print(e, null, opts, refs, path, depth)); }
	}
	
	// Boxed primitives
	else if(value instanceof Boolean) linesBefore.push(print(true.valueOf.call(value), null, opts, refs, path, depth));
	else if(value instanceof Number)  linesBefore.push(print(1.  .valueOf.call(value), null, opts, refs, path, depth));
	else if(value instanceof String)  linesBefore.push(print(""  .valueOf.call(value), null, opts, refs, path, depth)), isArrayLike = false;
	
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
				const offset = hexBorder + border + hexOffset + "0x" + i.toString(16).padStart(8, "0").toUpperCase() + hexBorder + border + off;
				const row = [...entries.subarray(i, i + 16)].map(x => x.toString(16).padStart(2, "0").toUpperCase()).join(" ");
				linesBefore.push(offset + hexValue + " " + row);
			}
		
		// Otherwise, list contents vertically
		else{
			let lastIndex = -1;
			[].forEach.call(entries, (x, i) => {
				if(lastIndex < i - 1)
					linesBefore.push(empty + `${i - lastIndex - 1}` + off);
				linesBefore.push(print(x,
					opts.indexes && !isArrayBuffer ? i : null,
					opts, refs,
					path + braceLeft + keys + i + braceRight + off,
					depth,
				));
				lastIndex = i;
			});
			if(lastIndex < length - 1)
				linesBefore.push(empty + `${length - lastIndex - 1}`);
		}
	}
	
	// Display the source code of function objects
	if("function" === typeof value && !opts.noSource && !tooDeep){
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
		linesAfter.push(...lines.map((line, index) =>
			srcBorder  + border +
			srcRowNum  + (index + 1).toString().padStart(pad, " ") +
			srcBorder  + border +
			srcRowText + " " + line + off));
	}
	
	// Property printing
	if(!tooDeep){
		// Handle property sorting
		props.push(...Object.getOwnPropertySymbols(value));
		opts.sort && props.sort((a, b) =>
			String(a).toLowerCase().localeCompare(String(b).toLowerCase()));
		
		// Identify Number/Math globals so we know when not to identify “magic” numbers
		flags = (Math === value) << 2 | (Number === value) << 1;
		
		// Show the `__proto__` object if possible (and requested)
		if(opts.proto){
			let proto;
			try{ proto = value.__proto__; }
			catch(e){ proto = e; opts = {...opts, proto: false}; }
			propLines.push(print(proto, "__proto__", opts, refs, path, depth, flags));
		}
	
		// Inspect each property we're interested in displaying
		for(let prop of props){
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
					propLines.push(print(result, prop, opts, refs, path, depth, flags));
				}
				else{
					prop = formatKey(prop);
					if(desc.get) propLines.push(print(desc.get, `get ${prop}`, opts, refs, path, depth, flags | 1));
					if(desc.set) propLines.push(print(desc.set, `set ${prop}`, opts, refs, path, depth, flags | 1));
				}
			}
			else propLines.push(print(desc.value, prop, opts, refs, path, depth, flags));
		}
	}
	
	// Pick an appropriate pair of brackets
	value = isArrayLike
		? [punct + "[" + off, "\n", punct + "]" + off]
		: [punct + "{" + off, "\n", punct + "}" + off];
	
	// If there's nothing of interest in a RegExp or Date object, use a 1-line form
	const numProps = propLines.length;
	if(!numProps && ("RegExp" === type || "Date" === type) && 1 === linesBefore.length)
		value = linesBefore, type = "";
	
	// Keep truncated objects on one line
	else if(tooDeep)
		value.splice(1, 1, linesBefore[0]);
	
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
	
	return key + (type ? typeColour + type + off + " " : "") + value.join("");
}
