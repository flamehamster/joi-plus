## Changelog

### 1.2.0

Update [@hapi/joi](https://www.npmjs.com/package/@hapi/joi) from version 16.1.8 to 17.1.0

### 1.1.4

Add requirement count to password policy

* If defined, password is required to pass the number of requirements.
* If undefined, password is required to pass all of requirements.


### 1.1.3

Add contain validation

* `Joi.string().contain('abc')`
* `Joi.string().contain('suffix', -1)`
* `Joi.string().contain('prefix', 0)`

### 1.1.2

Add unescape `&amp;` | `&gt;` | `&lt;` | `&quot;` | `&#36;` | `&#47;` | `&#92;` | `&#96;` HTML entities with characters.

* `Joi.string().unescape()` 

Add sanitize string using function that takes a string as a parameter.

```
Joi.string().sanitize((string) => {
	...
	return string;
})
``` 

### 1.1.1

Fix `type not defined` bug in ISO 3166 `alpha-2` and `alpha-3` country code string validation

### 1.1.0

Update [@hapi/joi](https://www.npmjs.com/package/@hapi/joi) from version 16.1.7 to 16.1.8

Add base32 string validation

* `Joi.string().base32()`

Add ISO 3166 `alpha-2` and `alpha-3` country code string validation

* `Joi.string().countryCode('alpha-2'|'alpha-3')`

Add escape `<`, `>`, `&`, `'`, `"`, `/`, `\` and `` ` `` with HTML entities.

* `Joi.string().escape()`
 
### 1.0.8

Initial commit on github