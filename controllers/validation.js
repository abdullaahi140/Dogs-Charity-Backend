/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Abdullaahi Farah
 * @see schemas/* for JSON Schema definition files
 */

const jsonschema = require('jsonschema');

const userSchema = require('../schema/user.schema.json').definitions.user;
const userUpdateSchema = require('../schema/user.schema.json').definitions.userUpdate;
const dogSchema = require('../schema/dog.schema.json').definitions.dog;
const dogUpdateSchema = require('../schema/dog.schema.json').definitions.dogUpdate;

/**
 * Wrapper that returns a Koa middleware validator for a given schema.
 * @param {Object} schema - The JSON schema definition of the resource
 * @param {string} resource - The name of the resource e.g. 'user'
 * @returns {function} - A Koa middleware handler taking (ctx, next) params
 */
const makeKoaValidator = function makeKoaValidator(schema, resource) {
	/**
	 * jsonschema Options object
	 * @type {jsonschema.Options}
	 */
	const validationOptions = {
		throwError: true,
		propertyName: resource
	};
	const v = new jsonschema.Validator();

	/**
	 * Koa middleware handler function to do validation
	 * @param {Object} ctx - The Koa request/response context object
	 * @param {function} next - The Koa next callback
	 * @throws {ValidationError} a jsonschema library exception
	 */
	const handler = async function handler(ctx, next) {
		const { body } = ctx.request;

		try {
			v.validate(body, schema, validationOptions);
			await next();
		} catch (error) {
			if (error instanceof jsonschema.ValidationError) {
				ctx.body = error;
				ctx.status = 400;
			} else {
				throw error;
			}
		}
	};
	return handler;
};

// Validate data against user schema for creating new users
exports.valUser = makeKoaValidator(userSchema, 'user');
// Validate data against user schema for updating existing users
exports.valUserUpdate = makeKoaValidator(userUpdateSchema, 'userUpdate');
// Validate data against user schema for creating new users
exports.valDog = makeKoaValidator(dogSchema, 'dog');
// Validate data against user schema for updating existing users
exports.valDogUpdate = makeKoaValidator(dogUpdateSchema, 'dogUpdate');
