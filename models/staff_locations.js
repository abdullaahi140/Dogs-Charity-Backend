/**
 * A module to manipulate data in the staff_locations table from the database.
 * @module models/staff_locations
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that adds dogs to the database.
 * @param {number} staffID - The staff's ID number
 * @param {number} locationID - The locations's ID number
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(staffID, locationID) {
	return knex.from('staff_locations').insert({ staffID, locationID })
		.catch((error) => KnexError(error));
};
