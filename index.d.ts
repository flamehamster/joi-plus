import Joi from 'joi';

interface StringSchema extends Joi.StringSchema {
	clean(): this;
	
	/* replace &, >, <, ", ', \, / and ` with HTML entities. */
	escape(): this;

	/* replace &amp;amp; | &amp;gt; | &amp;lt; | &amp;quot; | &amp;#36; | &amp;#47; | &amp;#92; | &amp;#96; HTML entities with characters. */
	unescape(): this;

	/*
		- sanitize string using function that takes a string as a parameter.
		- returns sanitize string
	*/
	sanitize(sanitizer: (value: string) => string): this;

	/* Requires the string value to only contain alphabetic characters. */
	alpha(): this;

	/* Requires the string value to only contain numeric characters. */
	numeric(): this;

	/* Requires the string value to be a valid decimal number. */
	decimal(digit: number, decimal: number): this;

	/* Requires the value to be a valid base32 string. */
	base32(): this;

	/* Requires the value to be a valid ISO alpha-2 or ISO alpha-3 country code. */
	countryCode(type: 'alpha-2' | 'alpha-3'): this;

	password(policy: {
		/* password minimum length, default 8. */
		min?: number;

		/* password maximum length, default 24. */
		max?: number;

		/* if true, password requires lowercase. */
		lowercase?: boolean;

		/* if true, password requires uppercase. */
		uppercase?: boolean;

		/* if true, password requires number. */
		number?: boolean;

		/* if true, password requires special character. */
		special?: boolean;

		/*
			- If defined, password is required to pass the number of requirements.
			- If undefined, password is required to pass all of requirements.
		*/
		count?: number;
	}): this;

	/*
		- Requires the string value to match the reference.
		- Removed after validation.
	*/
	match(reference: string): this;

	/*
		- Requires the string value to contain the seed.
		- If index is defined, position of the seed in the string must match the index.
		- Set index to -1 to match from end of string.
	*/
	contain(seed: string, index?: number): this;
}

interface Root extends Joi.Root {
	string(): StringSchema;
}

declare const root :Root;
export = root;
