"use strict";

const fs    = require("fs");
const path  = require("path");
const Chai  = require("chai");
const print = require("../print.js");

module.exports = {
	
	/**
	 * Read the entire content of a file into memory.
	 *
	 * @param {String} filePath
	 * @param {Boolean} [asBuffer=false] - Keep the data as a Buffer object.
	 * @return {String|Buffer}
	 */
	slurp(filePath, asBuffer = false){
		filePath = path.resolve(__dirname, filePath);
		const output = fs.readFileSync(filePath);
		return asBuffer ? output : output.toString();
	},
};

// Small plugin to strip excess indentation in specs
Chai.Assertion.addMethod("print", function(expected, options){
	const subject = Chai.util.flag(this, "object");
	const printed = print(subject, options);
	
	if("string" === typeof expected && /\n/.test(expected))
		expected = deindent(expected);
	
	this.assert(
		expected === printed,
		"expected #{this} to print #{exp}",
		"expected #{this} not to print #{exp}",
		printed,
		expected,
		true
	);
});


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
