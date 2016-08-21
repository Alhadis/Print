#!/usr/local/bin/node --es_staging
"use strict";

const print     = require("./print.js");
const assert    = require("assert");
const fs        = require("fs");

class Example{
	constructor(name){
		this.name = name;
		this.nameInReverse = name.split("").reverse().join("");
		this.nameWhenShouting = name.toUpperCase();
		this.nameWhenShoutingDrunk = this.nameInReverse.toUpperCase();
	}
}

class ObviousExample extends Example{
	constructor(name){
		super("Foo Bar");
	}
}


let wrong;
try{ assert.equal(true, false, "NIKKA WAT U SMOKIN"); }
catch(e){
	wrong = e;
}


const buffer = fs.readFileSync(__filename);
buffer.customValue = "Is very custom";


let input = {
	word:    "String",
	number:  1024 * 768,
	object:  {},
	list:    [],
	ints:    new Uint16Array(224),
	floats:  new Float64Array(24),
	
	lameNerdPuns: Math.PI,
	
	oath: Promise.resolve(),
	
	gen: function* erator(){
		yield "POWER";
	},
	
	classExample: new ObviousExample(),
	classRef: ObviousExample,
	
	func: function pointless(value){
		return value; // Best function ever
	},
	
	args: (function(){
		return arguments;
	}("A", "B", {a: "C"})),
	
	buffer,
	err: new Error("... what?"),
	wrong
};

input = [
	".o0(	|	|	|	)0o.",
	`
	1.
	2.
	3.
	4.
	5.`
];

const opts = {
	escapeChars: false,
	showArrayIndices: true,
	showArrayLength: true
};

let t = print(input, opts);

console.log(t);
