'use strict';

const Joi = require('@hapi/joi');

module.exports = Joi.extend(
	require('./libraries/string'),
	require('./libraries/array')
);