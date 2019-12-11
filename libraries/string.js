'use strict';
const alpha2 = require('../libraries/alpha-2');
const alpha3 = require('../libraries/alpha-3');

const clean = /^[^><\\\`{}]+$/;
const escape = /^(?=.*[&"'<>`/\\]).*$/;
const unescape = /&amp;|&gt;|&lt;|&quot;|&#36;|&#47;|&#92;|&#96;/;
const alpha = /^[a-zA-Z]+$/;
const numeric = /^[0-9]+$/;
const base32 = /^[A-Z2-7]+=*$/;
const password = /^[ -~]+$/;

const lowercase = /[a-z]/;
const uppercase = /[A-Z]/;
const number = /[\d]/;
const special = /[ -/:-@[-`{-~]/;

module.exports = (joi) => {
	return {
		type: 'string',
		base: joi.string(),
		messages: {
			'string.clean': '"{{#label}}" contains illegal characters: > < \\ ` } {',
			'string.escape': '"{{#label}}" contains characters that need to escape: & > < " \' / \\ `',
			'string.unescape': '"{{#label}}" contains HTML entities that need to unescape: &amp; | &gt; | &lt; | &quot; | &#36; | &#47; | &#92; | &#96;',
			'string.alpha': '"{{#label}}" must only contain alphabetic characters',
			'string.numeric': '"{{#label}}" must only contain numeric characters',
			'string.base32': '"{{#label}}" must be a valid base32 string',
			'string.countryCode': '"{{#label}}" must be a valid ISO {{#type}} country code',
			'string.password': '"{{#label}}" {{#message}}',
			'string.contain': '"{{#label}}" must contain "{{#seed}}"{{#message}}'
		},
		coerce(value, helpers) {
			if (helpers.schema.$_getRule('escape')) {
				value = value.replace(/&/g, '&amp;')
							.replace(/>/g, '&gt;')
							.replace(/</g, '&lt;')
							.replace(/"/g, '&quot;')
							.replace(/'/g, '&#36;')
							.replace(/\//g, '&#47;')
							.replace(/\\/g, '&#92;')
							.replace(/`/g, '&#96;');
			}
			if (helpers.schema.$_getRule('unescape')) {
				value = value.replace(/&amp;/g, '&')
							.replace(/&gt;/g, '>')
							.replace(/&lt;/g, '<')
							.replace(/&quot;/g, '"')
							.replace(/&#36;/g, "'")
							.replace(/&#47;/g, '/')
							.replace(/&#92;/g, '\\')
							.replace(/&#96;/g, '`');
			}
			return { value };
		},
		rules: {
			clean: {
				validate: (value, helpers, args, options) => {
					if (clean.test(value)) {
						return value;
					}
					return helpers.error('string.clean');
				}
			},
			escape: {
				convert: true,
				method() {
					return this.$_addRule('escape');
				},
				validate: (value, helpers, args, options) => {
					if (!escape.test(value)) {
						return value;
					}
					return helpers.error('string.escape');
				}
			},
			unescape: {
				convert: true,
				method() {
					return this.$_addRule('unescape');
				},
				validate: (value, helpers, args, options) => {
					if (!unescape.test(value)) {
						return value;
					}
					return helpers.error('string.unescape');
				}
			},
			sanitize: {
				method(sanitizer) {
					return this.$_addRule({ name: 'sanitize', args: { sanitizer } });
				},
				args: [
					{
						name: 'sanitizer',
						assert: (value) => typeof value === 'function',
						message: 'must be a function'
					}
				],
				validate: (value, helpers, args, options) => {
					return args.sanitizer(value);
				}
			},
			alpha: {
				validate: (value, helpers, args, options) => {
					if (alpha.test(value)) {
						return value;
					}
					return helpers.error('string.alpha');
				}
			},
			numeric: {
				validate: (value, helpers, args, options) => {
					if (numeric.test(value)) {
						return value;
					}
					return helpers.error('string.numeric');
				}
			},
			base32: {
				validate: (value, helpers, args, options) => {
					if (value.length > 0 && value.length % 8 === 0 && base32.test(value)) {
						return value;
					}
					return helpers.error('string.base32');
				}
			},
			countryCode: {
				method(type = 'alpha-2') {
					return this.lowercase().$_addRule({ name: 'countryCode', args: { type } });
				},
				args: [
					{
						ref: true,
						name: 'type',
						assert: (value) => value === 'alpha-2' || value === 'alpha-3',
						message: 'must be "alpha-2" or "alpha-3"'
					}
				],
				validate: (value, helpers, args, options) => {
					let type = args.type;
					if (type === 'alpha-2' && alpha2.includes(value)) {
						return value;
					} else if (type === 'alpha-3' && alpha3.includes(value)) {
						return value;
					}
					return helpers.error('string.countryCode', { type });
				}
			},
			password: {
				method(policy = {}) {
					let min = policy.min || 8;
					let max = policy.max || 24;
					return this.min(min).max(max).$_addRule({ name: 'password', args: { policy } });
				},
				args: [
					{
						name: 'policy',
						assert: (value) => typeof value === 'object' && !Array.isArray(value),
						message: 'must be an object'
					}
				],
				validate: (value, helpers, args, options) => {
					if (!password.test(value)) {
						return helpers.error('string.password', { message: 'contains illegal characters' });
					}

					let policy = args.policy;
					let requirement = 0;
					let count = 0;
					let message = '';
					let error = false;

					if (policy.lowercase) {
						requirement++;
						message += ' one lowercase character,';
						if (lowercase.test(value)) {
							count++;
						}
					}
					if (policy.uppercase) {
						requirement++;
						message += ' one uppercase character,';
						if (uppercase.test(value)) {
							count++;
						}
					}
					if (policy.number) {
						requirement++;
						message += ' one numeric character,';
						if (number.test(value)) {
							count++;
						}
					}
					if (policy.special) {
						requirement++;
						message += ' one special character,';
						if (special.test(value)) {
							count++;
						}
					}
					message = message.slice(0, -1);
					
					if (policy.count && policy.count > 0 && policy.count < requirement) {
						if (policy.count > count) {
							error = true;
							message = ` ${policy.count} of the ${requirement} requirements:` + message;
						}
					} else if (count !== requirement) {
						error = true;
					}

					if (error) {
						message = 'must contains at least' + message;
						return helpers.error('string.password', { message });
					}
					
					return value;
				}
			},
			match: {
				method(reference) {
					return this.valid(joi.ref(reference)).prefs({
						messages: {
							'any.only': `"{{#label}}" must match "${reference}"`
						}
					}).strip();
				}
			},
			contain: {
				method(seed, index) {
					return this.lowercase().$_addRule({ name: 'contain', args: { seed, index } });
				},
				args: [
					{
						ref: true,
						name: 'seed',
						assert: (value) => typeof value === 'string',
						message: `must be a string`
					},
					{
						ref: true,
						name: 'index',
						assert: (value) => value === undefined || typeof value === 'number' && value >= -1,
						message: `must be equal or more than -1`
					}
				],
				validate: (value, helpers, args, options) => {
					let seed = args.seed;
					let index = args.index;

					if (index) {
						if (index === -1) {
							index = value.length - seed.length;
						}
						if (value.indexOf(seed, index) === index) {
							return value;
						}
						let message = ` at index ${index}`;
						return helpers.error('string.contain', { seed, message });
					} else {
						if (value.includes(seed)) {
							return value;
						}
						return helpers.error('string.contain', { seed });
					}
				}
			}
		}
	}
}