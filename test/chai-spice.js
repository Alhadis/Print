"use strict";

/**
 * Chai served with a little extra.
 */

const print  = require("../print.js");
const Chai   = require("chai");
const {util} = Chai;
require("chai-untab");


/** Wrapper to make this module's specs less verbose */
Chai.Assertion.addMethod("print", function(expected, options){
	const subject = util.flag(this, "object");
	const printed = print(subject, options);
	expected = Chai.doUntab(expected);
	
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
