"use strict";

/**
 * Chai served with a little extra.
 */

const print  = require("../print.js");
const Chai   = require("chai");
const {util} = Chai;


let overwritten;
let unindentPattern;
let columnCount;


/** Unindent a value if it's a string, and Chai.unindent has been called */
function trimIfNeeded(input){
	if(unindentPattern && "[object String]" === Object.prototype.toString.call(input)){
		unindent.noTrim || (input = input.replace(/^(?:[\x20\t]*\n)*|(?:\n[\x20\t]*)*$/gi, ""));
		return input.replace(unindentPattern, "");
	}
	return input;
}


/**
 * Strip leading tabulation from string blocks when running "equal" method.
 *
 * Enables use of ES6 template strings like triple-quoted strings (Python/CoffeeScript).
 *
 * @param {Number} columns - Number of leading tabs to strip from each line
 * @param {String} char - What defines a "tab". Defaults to a hard tab.
 */
function unindent(columns, char = "\t"){
	
	/** If Chai.unindent hasn't been run yet, overwrite the necessary methods */
	if(!overwritten){
		overwritten = true;
		
		for(const method of ["equal", "string"]){
			Chai.Assertion.overwriteMethod(method, function(__super){
				return function(input, ...rest){
					__super.apply(this, [ trimIfNeeded(input), ...rest ]);
				}
			});
		}
	}
	
	columnCount = columns;
	unindentPattern = columns
		? new RegExp("^(?:"+char+"){0,"+columns+"}", "gm")
		: null;
};

Chai.unindent = unindent;


/** Wrapper to make adjusting column-counts even easier */
Object.defineProperty(Chai, "untab", {
	get(){ return columnCount },
	set(i){
		if(i == columnCount) return;
		beforeEach(() => Chai.unindent(i));
		afterEach(() => Chai.unindent(false));
	}
});



/** Wrapper to make this module's specs less verbose */
Chai.Assertion.addMethod("print", function(expected, options){
	const subject = util.flag(this, "object");
	const printed = print(subject, options);
	expected = trimIfNeeded(expected);
	
	this.assert(
		expected === printed,
		"expected #{this} to print #{exp}",
		"expected #{this} not to print #{exp}",
		printed,
		expected,
		true
	);
});


module.exports = Chai;
