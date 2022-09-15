#!/bin/sh
//bin/sh -c :; exec node "$0" -- "$@"; # -*- JS -*-

import print from "./print.mjs";

const str = print(globalThis, "globalThis", {
	all:      true,
	attr:     true,
	colours:  true,
	proto:    true,
	maxDepth: Infinity,
});

if("object" === typeof console && console && "function" === typeof console.log)
	console.log(str);

else if("function" === typeof globalThis.print && globalThis.print !== print)
	globalThis.print(str);

else throw str;
