/**
 * A module to manipulate data in the locations table from the database.
 * @module models/locations
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets a location using the staff code.
 * @param {Object} user - Object with dog's information
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getByStaffId = async function getByStaffId(staffCode) {
	return knex.from('locations').select('ID').where({ staffCode })
		.catch((error) => KnexError(error));
};
