"use strict";

const fs   = require("fs");
const path = require("path");


module.exports = {

	MathConstants: [
		"E",
		"LN10",
		"LN2",
		"LOG10E",
		"LOG2E",
		"PI",
		"SQRT1_2",
		"SQRT2",
	],
	
	NumberConstants: [
		"EPSILON",
		"MIN_VALUE",
		"MAX_VALUE",
		"MIN_SAFE_INTEGER",
		"MAX_SAFE_INTEGER",
		"NEGATIVE_INFINITY",
		"POSITIVE_INFINITY",
	],
	
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
	}
};
