'use strict';

const Joi = require('joi').extend(
	require('./libraries/string')
);

module.exports = Joi;