/**
 * A module to manipulate data in the dog_locations table from the database.
 * @module models/dog_locations
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that adds dogs to the database.
 * @param {Object} user - Object with dog's information
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(dog) {
	return knex.from('dog_locations').insert(dog)
		.catch((error) => KnexError(error));
};
