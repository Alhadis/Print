"use strict";

/**
 * Chai served with a little extra.
 */

const print  = require("../print.js");
const Chai   = require("chai");
const {util} = Chai;


let overwritten, unindentPattern;

/**
 * Strip leading tabulation from string blocks when running "equal" method.
 *
 * Enables use of ES6 template strings like triple-quoted strings (Python/CoffeeScript).
 *
 * @param {Number} columns - Number of leading tabs to strip from each line
 * @param {String} char - What defines a "tab". Defaults to a hard tab.
 */
Chai.unindent = function(columns, char = "\t"){
	
	/** If Chai.unindent hasn't been run yet, overwrite the necessary methods */
	if(!overwritten){
		overwritten = true;
		
		for(const method of ["equal", "string"]){
			Chai.Assertion.overwriteMethod(method, function(__super){
				return function(input, ...rest){
					let obj = util.flag(this, "object");
					
					if("[object String]" === Object.prototype.call(input)){
						const trimmed = input.replace(unindentPattern, "");
						__super.apply(this, [trimmed, ...rest]);
					}
					else __super.apply(this, arguments);
				}
			});
		}
	}
	
	unindentPattern = columns
		? new RegExp("^(?:"+char+"){0,"+columns+"}", "gm")
		: null;
};



/**
 * Wrapper to make this module's specs less verbose.
 */
Chai.Assertion.addMethod("print", function(expected, options){
	const subject = util.flag(this, "object");
	const printed = print(subject, options);
	
	this.assert(
		expected === printed,
		"expected #{this} to print #{exp}",
		"expected #{this} not to print #{exp}",
		printed
	);
});


module.exports = Chai;
