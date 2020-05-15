'use strict';

const Joi = require('@hapi/joi').extend(
	require('./libraries/string')
);

module.exports = Joi;