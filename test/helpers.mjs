import print from "../print.mjs";

export function expect(actual){
	return {
		get to()    { return this; },
		get be()    { return this; },
		get true()  { return this.equal(true,  "Expected value to be true"); },
		get false() { return this.equal(false, "Expected value to be false"); },
		equal(expected, msg = "Expected values to be equal"){
			if(actual === expected) return this;
			throw Object.assign(new Error(msg), {actual, expected});
		},
		print(expected, opts = {}){
			if("string" === typeof expected && ~expected.indexOf("\n"))
				expected = deindent(expected);
			actual = print(actual, opts);
			return this.equal(expected);
		},
	};
}

/**
 * Strip excess whitespace from a multiline string.
 * @return {String}
 */
function deindent(...args){
	
	// Avoid breaking on String.raw if called as an ordinary function
	if("object" !== typeof args[0] || "object" !== typeof args[0].raw)
		return deindent `${args[0]}`;
	
	const depthTable = [];
	let maxDepth = Number.NEGATIVE_INFINITY;
	let minDepth = Number.POSITIVE_INFINITY;
	
	// Normalise newlines and strip leading or trailing blank lines
	const chunk = String.raw.call(null, ...args)
		.replace(/\r(\n?)/g, "$1")
		.replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, "");

	for(const line of chunk.split(/\n/)){
		// Ignore whitespace-only lines
		if(!/\S/.test(line)) continue;
		
		const indentString = line.match(/^[ \t]*(?=\S|$)/)[0];
		const indentLength = indentString.replace(/\t/g, " ".repeat(8)).length;
		if(indentLength < 1) continue;

		const depthStrings = depthTable[indentLength] || [];
		depthStrings.push(indentString);
		maxDepth = Math.max(maxDepth, indentLength);
		minDepth = Math.min(minDepth, indentLength);
		if(!depthTable[indentLength])
			depthTable[indentLength] = depthStrings;
	}

	if(maxDepth < 1)
		return chunk;
	
	const depthStrings = new Set();
	for(const column of depthTable.slice(0, minDepth + 1)){
		if(!column) continue;
		depthStrings.add(...column);
	}
	depthStrings.delete(undefined);
	const stripPattern = [...depthStrings].reverse().join("|");
	return chunk.replace(new RegExp(`^(?:${stripPattern})`, "gm"), "");
}
