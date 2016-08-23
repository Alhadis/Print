"use strict";


/**
 * Generate a human-readable representation of a value.
 *
 * @param  {Mixed}  input
 * @param  {Object} options
 * @return {String} output
 */
function print(input, options = {}, name = "", refs = null){
	
	/** Handle options/defaults */
	let {
		escapeChars,
		maxArrayLength,
		nativeSymbols,
		showArrayIndices,
		showArrayLength,
		sortProps
	} = options;
	
	escapeChars    = undefined === escapeChars    ? /(?!\x20)\s|\\/g : escapeChars;
	sortProps      = undefined === sortProps      ? true  : sortProps;
	maxArrayLength = undefined === maxArrayLength ? 100   : (!+maxArrayLength ? false : maxArrayLength);

	if(escapeChars && "function" !== typeof escapeChars)
		escapeChars = (function(pattern){
			return function(input){
				return input.replace(pattern, function(char){
					switch(char){
						case "\f": return "\\f";
						case "\n": return "\\n";
						case "\r": return "\\r";
						case "\t": return "\\t";
						case "\v": return "\\v";
						case "\\": return "\\\\";
					}
					const cp  = char.codePointAt(0);
					const hex = cp.toString(16).toUpperCase();
					if(cp < 0xFF) return "\\x" + hex;
					return "\\u{" + hex + "}";
				});
			}
		}(escapeChars));
	
	
	/** Only thing that can't be checked with obvious methods */
	if(Number.isNaN(input)) return "NaN";
	
	/** Exact match */
	switch(input){
		
		/** Primitives */
		case null:      return "null";
		case undefined: return "undefined";
		case true:      return "true";
		case false:     return "false";
		
		/** "Special" values */
		case Math.E:                   return "Math.E";
		case Math.LN10:                return "Math.LN10";
		case Math.LN2:                 return "Math.LN2";
		case Math.LOG10E:              return "Math.LOG10E";
		case Math.LOG2E:               return "Math.LOG2E";
		case Math.PI:                  return "Math.PI";
		case Math.SQRT1_2:             return "Math.SQRT1_2";
		case Math.SQRT2:               return "Math.SQRT2";
		
		case Number.EPSILON:           return "Number.EPSILON";
		case Number.MIN_VALUE:         return "Number.MIN_VALUE";
		case Number.MAX_VALUE:         return "Number.MAX_VALUE";
		case Number.MIN_SAFE_INTEGER:  return "Number.MIN_SAFE_INTEGER";
		case Number.MAX_SAFE_INTEGER:  return "Number.MAX_SAFE_INTEGER";
		case Number.NEGATIVE_INFINITY: return "Number.NEGATIVE_INFINITY";
		case Number.POSITIVE_INFINITY: return "Number.POSITIVE_INFINITY";
	}
	
	/** Basic data types */
	const type = Object.prototype.toString.call(input);
	switch(type){
		case "[object Symbol]":
		case "[object Number]":  return input.toString();
		case "[object RegExp]":  return `/${input.source}/${input.flags}`;
		case "[object WeakMap]": return "WeakMap";
		case "[object WeakSet]": return "WeakSet";
		case "[object String]":{
			if(escapeChars)
				input = escapeChars(input);
			
			return `"${input}"`;
		}
	}
	
	/** Guard against circular references */
	refs = refs || new Map();
	if(refs.has(input))
		return "-> " + (refs.get(input) || "{input}");
	refs.set(input, name);
	
	
	/** Maps */
	if("[object Map]" === type){
		let output = "";
		let index  = 0;
		
		for(let entry of input.entries()){
			const namePrefix  = (name ? name : "Map") + ".entries";
			const keyString   = `${index}.` + "key";
			const valueString = `${index}.` + "value";
			
			let [key, value] = entry;
			key   = print(key,   options, `${namePrefix}[${keyString}]`,   refs);
			value = print(value, options, `${namePrefix}[${valueString}]`, refs);
			
			/** Key */
			let delim = /^->\s/.test(key) ? " " : " => ";
			let str = keyString + delim + key;
			
			/** Value */
			delim   = /^->\s/.test(value) ? " " : " => ";
			str    += "\n" + valueString + delim + value;
			
			output += str.replace(/^/gm, "\t") + "\n\n";
			++index;
		}
		
		return "Map{\n" + output.replace(/(?:\n\s*\n)+$/m, "") + "\n}";
	}
	
	
	/** Sets */
	if("[object Set]" === type){
		let output = "";
		let index  = 0;
		
		for(let value of input.values()){
			const valueName = (name ? name : "{input}") + ".entries[" + index + "]";
			value = print(value, options, valueName, refs);
			
			const delim = /^->\s/.test(value) ? " " : " => ";
			output += index + delim + value + "\n";
			++index;
		}
		
		return "Set{\n" + output.replace(/(?:\n\t*\n?)+$/, "").replace(/^/gm, "\t") + "\n}";
	}
	
	
	/** Objects, Arrays, and Functions */
	const arrayLike     = "function" === typeof input[Symbol.iterator];
	const isFunc        = "function" === typeof input;
	const ignoreNumbers = !showArrayIndices && arrayLike;
	
	
	/** Obtain a list of every (non-symbolic) property to show */
	let keys = Object.keys(input);
	
	/** Functions: Include name and arity */
	if(isFunc){
		if(-1 === keys.indexOf("name"))    keys.push("name");
		if(-1 === keys.indexOf("length"))  keys.push("length");
	}
	
	/** Errors: Include name and message */
	else if(input instanceof Error){
		if(-1 === keys.indexOf("name"))    keys.push("name");
		if(-1 === keys.indexOf("message")) keys.push("message");
	}
	
	/** Arrays: Add length if requested */
	else if(arrayLike && showArrayLength && -1 === keys.indexOf("length"))
		keys.push("length");
	

	/** Clip lengthy arrays to a sensible limit */
	let truncationNote = null;
	if(maxArrayLength !== false && arrayLike && input.length > maxArrayLength){
		keys = keys.filter(k => +k != k || +k < maxArrayLength);
		truncationNote = `\n\n… ${input.length - maxArrayLength} more values not shown\n`;
	}
	
	
	/** Alphabetise each property name */
	if(sortProps) keys = keys.sort((a, b) => {
		let A, B;
		
		/** Numbers: Compare algebraically */
		if(("0" == a || +a == a) && ("0" == b || +b == b)){
			A = +a;
			B = +b;
		}
		
		/** Anything else: Convert to lowercase */
		else{
			A = a.toLowerCase();
			B = b.toLowerCase();
		}
		
		if(A < B) return -1;
		if(A > B) return 1;
		return 0;
	});
	
	
	/** Begin compiling some serious output */
	let output = "";
	
	/** Regular properties */
	for(let i = 0, l = keys.length; i < l; ++i){
		let key      = keys[i];
		
		/** Array's been truncated, and this is the first non-numeric key */
		if(null !== truncationNote && +key != key){
			output  += truncationNote;
			truncationNote = null;
		}
		
		let accessor = /\W|^\d+$/.test(key) ? `[${key}]` : (name ? "."+key : key);
		let value    = print(input[key], options, name + accessor, refs);
		output      += "\n";
		
		/** Arrays: Check if each value's index should be omitted */
		if(ignoreNumbers && /^\d+$/.test(key))
			output += value;
		
		/** Name: Value */
		else output += `${key}: ${value}`;
	}
	
	/** If we still have a truncation notice, it means there were only numerics to list */
	if(null !== truncationNote)
		output += truncationNote.replace(/\n+$/, "");
	
	
	/** Properties keyed by Symbols */
	let symbols = Object.getOwnPropertySymbols(input);
	if(sortProps) symbols = symbols.sort((a, b) => {
		const A = a.toString().toLowerCase();
		const B = b.toString().toLowerCase();
		if(A < B) return -1;
		if(A > B) return 1;
		return 0;
	});
	
	for(let i = 0, l = symbols.length; i < l; ++i){
		const symbol = symbols[i];
		let accessor = symbol.toString();
		let valName  = "[" + accessor + "]";
		
		/** Use a @@-prefixed form to represent Symbols in property lists */
		if(!nativeSymbols){
			accessor = "@@" + accessor.replace(/^Symbol\(|\)$/g, "");
			valName  = (name ? "." : "") + accessor;
		}
		
		const value = print(input[symbol], options, name + valName, refs);
		output += `\n${accessor}: ${value}`;
	}
	
	
	/** Tweak output based on the value's type */
	let typePrefix = "";
	
	if("[object Arguments]" === type)
		typePrefix = "Arguments";
	
	else{
		const ctr = input.constructor.name;
		switch(ctr){
			
			case "GeneratorFunction":
				typePrefix = "function*()";
				break;
			
			case "Function":
				typePrefix = "function()";
				break;
			
			case "Array":
			case "Object":
				typePrefix = "";
				break;
			
			default:
				typePrefix = ctr;
				break;
		}
	}
	
	output = output ? output.replace(/\n/g, "\n\t") + "\n" : "";
	return typePrefix + (arrayLike
		? "[" + output + "]"
		: "{" + output + "}");
}

module.exports = print;
