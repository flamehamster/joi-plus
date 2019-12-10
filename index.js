'use strict';

const Joi = require('@hapi/joi').extend(
	require('./libraries/string'),
	require('./libraries/array')
);

module.exports = Joi;