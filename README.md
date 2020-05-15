# Joi-Plus

[![npm package](https://img.shields.io/npm/v/joi-plus.svg)](http://npmjs.org/package/joi-plus) [![npm license](https://img.shields.io/npm/l/joi-plus)](https://img.shields.io/npm/l/joi-plus) [![install size](https://packagephobia.now.sh/badge?p=joi-plus@1.1.2)](https://packagephobia.now.sh/result?p=joi-plus@1.1.2) [![dependencies status](https://david-dm.org/flamehamster/joi-plus/status.svg)](https://david-dm.org/flamehamster/joi-plus)

[@hapi/joi - v17.1.1](https://www.npmjs.com/package/@hapi/joi)
Making the most powerful schema description language and data validator for JavaScript slightly more powerful.

## Introduction

* Joi.string().escape()
	* replace `&`, `>`, `<`, `"`, `'`, `\`, `/` and `` ` `` with HTML entities.

* Joi.string().unescape()
	* replace `&amp;` | `&gt;` | `&lt;` | `&quot;` | `&#36;` | `&#47;` | `&#92;` | `&#96;` HTML entities with characters.

* Joi.string().sanitize(function)
	* sanitize string using function that takes a string as a parameter.
	* returns sanitize string

* Joi.string().alpha()
	* Requires the string value to only contain alphabetic characters.

* Joi.string().numeric()
	* Requires the string value to only contain numeric characters.

* Joi.string().base32()
	* Requires the value to be a valid base32 string.

* Joi.string().countryCode(type)
	* Requires the value to be a valid ISO `alpha-2` or ISO `alpha-3` country code.

* Joi.string().password(policy)
	* Requires the string value to match policy.
		* policy.min - password minimum length, default 8.
		* policy.max - password maximum length, default 24.
		* policy.lowercase - if true, password requires lowercase.
		* policy.uppercase - if true, password requires uppercase.
		* policy.number - if true, password requires number.
		* policy.special - if true, password requires special character.
		* policy.count
			* If defined, password is required to pass the number of requirements.
			* If undefined, password is required to pass all of requirements.

* Joi.string().match(reference)
	* Requires the string value to match the reference.
	* Removed after validation.

* Joi.string().contain(seed, [index])
	* Requires the string value to contain the seed.
	* If index is defined, position of the seed in the string must match the index.
	* Set index to -1 to match from end of string.

## Quick Start

### Installation
```bash
$ npm i joi-plus
```

### Initialization
```js
const Joi = require('joi-plus');
```

## Usage

```js
const schema = Joi.object({
	username: Joi.string()
		.min(8)
		.max(20)
		.alpha()
		.required(),

	email: Joi.string()
		.email()
		.required(),

	password: Joi.string()
		.password({
			min: 8,
			max: 120,
			lowercase: true,
			uppercase: true,
			number: true,
			special: true,
			count: 3
		})
		.required(),

	repeat_password: Joi.string()
		.match('password')
		.required(),

	base32_encoded: Joi.string()
		.base32()
		.required(),

	country: Joi.string()
		.countryCode('alpha-2')
		.required(),

	contact_number: Joi.string()
		.min(2)
		.max(20)
		.numeric()
		.required()
});
```

The above schema defines the following constraints:
* `username`
	* a required string
	* at least 8 characters long but no more than 20
	* must contain only alphabetic characters
* `email`
	* a required string
	* a valid email address string
* `password`
	* a required string
	* at least 8 characters long but no more than 120
	* must contain at least 3 of the 4 requirements
		* one lowercase character
		* one uppercase character
		* one numeric character
		* one special character
			* _space_ ! " # $ % & ' ( ) * + , - . : ; < = > ? @ [ \ ] ^ _ \` { | } ~ 
* `repeat_password`
	* a required string
	* must match `password`
	* will be removed after validation
* `base32_encoded`
	* a required string
	* a valid base32 string
* `country`
	* a required string
	* must be a valid ISO 'alpha-2' country code
* `contact_number`
	* a required string
	* at least 2 characters long but no more than 20
	* must contain only numeric characters

#### Sanitize
Using Joi.string().sanitize() with sanitization libraries such as [sanitize-html](https://www.npmjs.com/package/sanitize-html)

```js
const sanitizeHtml = require('sanitize-html');

const schema = Joi.object({
	escape: Joi.string()
		.escape(),

	unescape: Joi.string()
		.unescape(),

	sanitize: Joi.string()
		.sanitize(sanitizeHtml)
});

let { error, value } = schema.validate({
	escape: '<escape>',
	unescape: '&lt;unescape&gt;',
	sanitize: 'Hello,<script>evil()</script> I am Good.'
});

console.log(value);
/*
{
	escape: '&lt;escape&gt;',
	unescape: '<unescape>',
	sanitize: 'Hello, I am Good.'
}
*/
```