/**
 * A module to manipulate data in the images table from the database.
 * @module models/images
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets images from the database using an ID number.
 * @param {number} ID - The image ID number
 * @returns {Array<Object>} - Array of chat objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(ID) {
	return knex.from('images').select('*').where({ ID })
		.catch((error) => KnexError(error));
};

/**
 * Function that adds an image to the database.
 * @param {number} image - The ID of the user
 * @returns {Array} - Array with ID's of messages added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(image) {
	return knex.from('images').insert(image)
		.catch((error) => KnexError(error));
};

/**
 * Function that removes an image from the database.
 * @param {number} ID - The image ID
 * @returns {number} - The number of rows deleted by the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delById = async function delById(ID) {
	return knex.from('images').del().where({ ID })
		.catch((error) => KnexError(error));
};
