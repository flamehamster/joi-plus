'use strict';

module.exports = (joi) => {
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
}