const Joi = require('@hapi/joi');
module.exports = Joi.extend((joi) => {
	return {
		type: 'string',
		base: joi.string(),
		messages: {
            'string.numeric': '"{{#label}}" must only contain numeric characters',
            'string.clean': '"{{#label}}" contains illegal characters: \\ > < } { `',
            'string.password': '"{{#label}}" {{#message}}'
		},
		rules: {
			numeric: {
				validate: (value, helpers, args, options) => {
					if (/^[0-9]+$/.test(value)) {
						return value;
					}
					return helpers.error('string.numeric');
				}
			},
			clean: {
				validate: (value, helpers, args, options) => {
					if (/^[^<>{}\\\`]+$/.test(value)) {
						return value;
					}
					return helpers.error('string.clean');
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
					if (!/^.*[ -~]$/.test(value)) {
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
}, (joi) => {
	return {
		type: 'array',
		base: joi.array(),
		rules: {
			inList: {
				method(list, label) {
					let schema = joi.any().valid(...list);
					if (label) {
						return this.unique().items(schema.label(label));
					}
					return this.unique().items(schema);
				}
			}
		}
	}
});