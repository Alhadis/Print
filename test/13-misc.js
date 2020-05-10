"use strict";

const {expect} = require("chai");
const {join}   = require("path");
const {spawn}  = require("child_process");

describe("`print.out()` function", function(){
	this.slow(1000);
	
	it("exposes a shortcut for logging to console", () => {
		const fixture = join(__dirname, "fixtures", "log-message.js");
		const proc = spawn(process.execPath, [fixture], {windowsHide: true});
		proc.stdout.setEncoding("utf8");
		let output = "";
		proc.stdout.on("data", chunk => output += chunk);
		return new Promise((resolve, reject) => {
			proc.on("close", code => code ? reject(code) : resolve());
		}).then(() => expect(output).to.equal('"Foo Bar Baz"\n'));
	});
});
