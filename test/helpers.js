"use strict";

const fs   = require("fs");
const path = require("path");


module.exports = {
	
	/**
	 * Reads the entire content of a file into memory.
	 *
	 * @param {String} filePath
	 * @param {Boolean} asBuffer - Keep the data as a Buffer object.
	 * @return {String|Buffer}
	 */
	slurp(filePath, asBuffer = false){
		filePath = path.resolve(__dirname, filePath);
		const output = fs.readFileSync(filePath);
		return asBuffer ? output : output.toString();
	}
};
