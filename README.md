# Joi-Plus

[@hapi/joi - v16.1.7](https://www.npmjs.com/package/@hapi/joi)
Making the most powerful schema description language and data validator for JavaScript slightly more powerful.

## Introduction

* Joi.string().numeric()
	-- Requires the string value to only contain 0-9.

* Joi.string().password(rules)
	-- Requires the string value to match rules.

* Joi.string().match(reference)
	-- Requires the string value to match the reference.
	-- Removed after validation.

* Joi.array().inList(list, [label])
	-- Requires the value in array to match the list.
	-- Overrides the key name for value in error messages.

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

	contact_number: Joi.string()
		.min(2)
		.max(20)
		.numeric()
		.required(),

	fav_animals: Joi.array()
		.inList(['dog', 'cat', 'lion', 'tiger', 'elephant', 'hippo'], 'animals')
		.required()
})
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
        * _space_ ! " # $ % & ' ( ) * + , - . : ; < = > ? @ [ \ ] ^ _ ` { | } ~ 
* `repeat_password`
    * a required string
    * must match `password`
    * will be removed after validation
* `contact_number`
    * a required string
    * at least 8 characters long but no more than 120
    * must contain only numeric characters
* `fav_animals`
    * a required array
    * must be one of [dog, cat, lion, tiger, elephant, hippo]