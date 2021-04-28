/**
 * A module to manipulate data in the locations table from the database.
 * @module models/locations
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets all the locations excluding the staffCode.
 * @param {Object} user - Object with dog's information
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getAll = async function getAll(userID) {
	return knex.from('locations').select('locations.ID', 'name', 'locations.dateCreated')
		.whereNotIn('locations.ID', function excludeLocations() {
			this.from('locations').select('locations.ID')
				.leftJoin('chats', 'locations.ID', 'chats.locationID')
				.where('chats.userID', userID);
		})
		.catch((error) => KnexError(error));
};

/**
 * Function that gets a location using the location's ID number.
 * @param {Object} user - Object with dog's information
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(ID) {
	return knex.from('locations').select('ID', 'name', 'dateCreated').where({ ID })
		.catch((error) => KnexError(error));
};

/**
 * Function that gets a location using the staff code.
 * @param {Object} user - Object with dog's information
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getByStaffCode = async function getByStaffCode(staffCode) {
	return knex.from('locations').select('ID').where({ staffCode })
		.catch((error) => KnexError(error));
};
