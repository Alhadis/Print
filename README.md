<!--*- truncate-lines: t; indent-tabs-mode: t; -*- vim:set nowrap ts=4 noet: -->

Print
================================================================================
[![Build status: GitHub Actions][Actions-badge]][Actions-link]
[![Build status: AppVeyor][AppVeyor-badge]][AppVeyor-link]
[![Coverage status][Coverage-badge]][Coverage-link]
[![Latest release][NPM-badge]][NPM-link]

[AppVeyor-badge]: https://img.shields.io/appveyor/build/Alhadis/Print?label=AppVeyor&logo=appveyor&logoColor=%23ccc
[AppVeyor-link]:  https://ci.appveyor.com/project/Alhadis/Print
[Actions-badge]:  https://img.shields.io/github/workflow/status/Alhadis/Print/CI?label=GitHub%20Actions&logo=github
[Actions-link]:   https://github.com/Alhadis/Print/actions/workflows/ci.yml
[Coverage-badge]: https://coveralls.io/repos/github/Alhadis/Print/badge.svg
[Coverage-link]:  https://coveralls.io/github/Alhadis/Print
[NPM-badge]:      https://img.shields.io/npm/v/print.svg?colorB=brightgreen
[NPM-link]:       https://github.com/Alhadis/Print/releases/latest


Generates a diff-friendly, human-readable representation of a JavaScript object.
Ideal for preparing [`AssertionError`][1] feedback, or for inspecting objects in
environments where Node's [`util.inspect()`][2] is unavailable.

[1]: https://nodejs.org/api/assert.html#assert_class_assert_assertionerror
[2]: https://nodejs.org/api/util.html#util_util_inspect_object_options


Usage
--------------------------------------------------------------------------------
```js
import print from "./print.mjs";

let result;
result = print(subject);
result = print(subject, options);
result = print(subject, "label");
result = print(subject, "label", options);
```

`print()` returns a string containing an unambiguous representation of an object
or primitive, optionally prefixed with a [`label`][3]. The output format depends
on the subject's type, the presence or absence of properties, and [`options`][4]
set by the user.

[3]: #label
[4]: #options


#### `subject`
- **Type:** Any
- **Default:** `undefined`

The JavaScript value being printed.


#### `label`
- **Type:**     [`String`][] | [`Symbol`][]  
- **Default:**  `"{root}"`

The name of a property (or variable) that `subject` is associated with. This can
improve readability of object references (indicated by `->`), or clarify context
by prefixing output with a meaningful label.

```js
const targetObject = {
	foo: {},
	bar: {},
};
targetObject.bar.referenceToFoo = targetObject.foo;
print(targetObject, "subject");
```

The example above returns:
~~~
subject: {
	foo: {}
	bar: {
		referenceToFoo: -> subject.foo
	}
}
~~~


#### `options`
- **Type:**    [`Object`][]
- **Default:** `{}`

Additional settings for refining output. Unless mentioned otherwise, all options
default to `null` or `false`.

<!-- Options table ------------------------------------------------------------>
| Name            | Type          | Description                                |
|:----------------|:--------------|:-------------------------------------------|
| `all`           | [`Boolean`][] | Display non-enumerable properties          |
| `attr`          | [`Boolean`][] | Display [property attributes] as `<W,E,C>` |
| `followGetters` | [`Boolean`][] | Invoke getter functions                    |
| `indent`        | [`String`][]  | String (or num. of spaces) used to indent  |
| `indexes`       | [`Boolean`][] | Display the indexes of iterable entries    |
| `maxDepth`      | [`Number`][]  | Hide object details after _N_ recursions   |
| `noAmp`         | [`Boolean`][] | Don't format [well-known symbols] as `@@…` |
| `noHex`         | [`Boolean`][] | Don't format byte-arrays as hexadecimal    |
| `noSource`      | [`Boolean`][] | Don't display function source code         |
| `proto`         | [`Boolean`][] | Show `__proto__` properties if possible    |
| `sort`          | [`Boolean`][] | Sort properties alphabetically             |
<!----------------------------------------------------------------------------->


To-do list
--------------------------------------------------------------------------------
* [ ] Add options for…
	* [x] Annotating property attributes (writable, enumerable, configurable)
	* [ ] `maxLines`/`maxSize` for truncating length arrays or strings
* [ ] Document remaining options
* [x] Migrate to GitHub Actions
* [x] Shorten `sortProps` to just `sort`


<!-- Referenced links --------------------------------------------------------->
[`Boolean`]: https://mdn.io/Boolean
[`Number`]:  https://mdn.io/Number
[`Object`]:  https://mdn.io/Object
[`String`]:  https://mdn.io/String
[`Symbol`]:  https://mdn.io/Symbol
[property attributes]: https://mdn.io/JS/defineProperty
[well-known symbols]: https://mdn.io/Glossary/Symbol#Well-known_symbols
