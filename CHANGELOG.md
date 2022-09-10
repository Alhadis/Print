Change Log
==========

This project honours [Semantic Versioning](http://semver.org/).


[Unpublished]
------------------------------------------------------------------------
**Breaking changes:**
* __`print()` output is no longer consistent with v1's output.__  
  Authors who use this module to generate [`diff(1)`][1]-able print-outs
  of objects should update scripts and unit-tests to use the new format.
* __Module format is now native ESM instead of CommonJS.__  
  The entry-point has been renamed `print.mjs` and Node v13.2.0 or newer
  is now required to use this module.
* __`print.out()` has been removed.__  
  This did very little of importance whilst making the library dependent
  on the [WHATWG Console API][2], which isn't guaranteed to be supported
  by every ECMAScript environment.
* __Options have been renamed and certain defaults changed.__  
  In addition, the `escapeChars` and `showArrayLength` options have been
  removed. Both are overly-specific and of questionable usefulness.

**Enhancements:**
* Added recognition of [`Arguments`][3] objects
* Added support for printing [`__proto__`][4] properties
* Boxed primitives now include their internal `[[PrimitiveValue]]`
* Byte-arrays now display their contents as hex dumps
* Decorator characters can be customised via the `chars` option
* Functions now display their source-code when printed
* Only well-known symbols are identified using `@@…` notation
* Printed `Math` and `Number` globals now show values of named constants
* Support for property sorting, coloured output, and custom indentation

[1]: http://man.openbsd.org/diff.1
[2]: https://console.spec.whatwg.org/
[3]: https://mdn.io/JS/Arguments
[4]: https://mdn.io/JS/__proto__


[v1.2.0]
------------------------------------------------------------------------
**May 11th, 2020**  
* **Added:** Support for printing `BigInt` values
* **Fixed:** Buggy handling of subclasses and `Symbol.toStringTag`


[v1.1.0]
------------------------------------------------------------------------
**March 21st, 2018**  
* **Added:** Recognition of object-type primitives and async functions
* **Added:** Support for subclassed built-ins
* **Added:** The `invokeGetters` and `showAll` options
* **Fixed:** Breakage when printing invalid `Date` objects


[v1.0.2]
------------------------------------------------------------------------
**December 22nd, 2016**  
* **Fixed:** Missing support for `Date` objects


[v1.0.1]
------------------------------------------------------------------------
**October 1st, 2016**  
* **Fixed:** Breakage when printing functions which lack constructors.


[v1.0.0]
------------------------------------------------------------------------
**August 25th, 2016**  
Initial release.


<!-- Referenced links ------------------------------------------------->
[Unpublished]: ../../compare/v1.2.0...HEAD
[v1.2.0]: https://github.com/Alhadis/Print/releases/tag/v1.2.0
[v1.1.0]: https://github.com/Alhadis/Print/releases/tag/v1.1.0
[v1.0.2]: https://github.com/Alhadis/Print/releases/tag/v1.0.2
[v1.0.1]: https://github.com/Alhadis/Print/releases/tag/v1.0.1
[v1.0.0]: https://github.com/Alhadis/Print/releases/tag/v1.0.0
