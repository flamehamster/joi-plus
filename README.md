# Joi-Plus

[@hapi/joi - v16.1.8](https://www.npmjs.com/package/@hapi/joi)
Making the most powerful schema description language and data validator for JavaScript slightly more powerful.

## Introduction

* Joi.string().escape()
	* replace `&`, `>`, `<`, `"`, `'`, `\`, `/` and `` ` `` with HTML entities.

* Joi.string().unescape()
	* replace `&amp;` | `&gt;` | `&lt;` | `&quot;` | `&#36;` | `&#47;` | `&#92;` | `&#96;` HTML entities with characters.

* Joi.string().sanitize(function)
	* sanitize string using the function that takes a string as a parameter.
	* returns sanitize string

* Joi.string().alpha()
	* Requires the string value to only contain alphabetic characters.

* Joi.string().numeric()
	* Requires the string value to only contain numeric characters.

* Joi.string().base32()
	* Requires the value to be a valid base32 string.

* Joi.string().countryCode(type)
	* Requires the value to be a valid ISO `alpha-2` or ISO `alpha-3` country code.

* Joi.string().password(rules)
	* Requires the string value to match rules.

* Joi.string().match(reference)
	* Requires the string value to match the reference.
	* Removed after validation.

* Joi.array().inList(list, [label])
	* Requires the value in array to match the list.
	* Overrides the key name for value in error messages.

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
			special: true
		})
		.required(),

	repeat_password: Joi.string()
		.match('password')
		.required(),

	username: Joi.string()
		.min(2)
		.max(20)
		.alpha()
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
		.required(),

	fav_animals: Joi.array()
		.inList(['dog', 'cat', 'lion', 'tiger', 'elephant', 'hippo'], 'animals')
		.required()
});
```

The above schema defines the following constraints:
* `email`
	* a required string
	* a valid email address string
* `password`
	* a required string
	* at least 8 characters long but no more than 120
	* must contains at least one lowercase character
	* must contains at least one uppercase character
	* must contains at least one numeric character
	* must contains at least one special character
		* _space_ ! " # $ % & ' ( ) * + , - . : ; < = > ? @ [ \ ] ^ _ \` { | } ~ 
* `repeat_password`
	* a required string
	* must match `password`
	* will be removed after validation
* `username`
	* a required string
	* at least 8 characters long but no more than 20
	* must contain only alphabetic characters
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
* `fav_animals`
	* a required array
	* must be one of [dog, cat, lion, tiger, elephant, hippo]

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