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
			'string.password': '"{{#label}}" {{#message}}'
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
				method(rules = {}) {
					let min = rules.min;
					let max = rules.max;
					return this.min(min).max(max).$_addRule({ name: 'password', args: { rules } });
				},
				args: [
					{
						name: 'rules',
						assert: (value) => Object.keys(value).length > 0,
						message: 'must be an object'
					}
				],
				validate: (value, helpers, args, options) => {
					let rules = args.rules;
					let regex = '^';
					let message = 'must contains at least';
					if (rules.lowercase) {
						regex += '(?=.*[a-z])';
						message += ' one lowercase character,';
					}
					if (rules.uppercase) {
						regex += '(?=.*[A-Z])';
						message += ' one uppercase character,';
					}
					if (rules.number) {
						regex += '(?=.*\\d)';
						message += ' one numeric character,';
					}
					if (rules.special) {
						regex += '(?=.*[ -/:-@[-`{-~])';
						message += ' one special character,';
					}
					regex += '.*$';
					message = message.slice(0, -1);
					
					regex = new RegExp(regex);
					if (!regex.test(value)) {
						return helpers.error('string.password', { message });
					}
					if (!password.test(value)) {
						return helpers.error('string.password', { message: 'contains illegal characters' });
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
			}
		}
	}
}