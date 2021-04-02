/**
 * A module to manipulate data in the refresh table from the database.
 * @module models/refresh
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets row from database using ID.
 * @param {string} userID - The id of the user
 * @returns {Object} - Row containing user and refresh token
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(userID) {
	return knex.from('refresh').select('*').where({ userID })
		.catch((error) => KnexError(error));
};

/**
 * Function that adds a user to the database.
 * @param {Object} user - Object with the user's information
 * @returns {Array} - User IDs of the rows added to the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(user) {
	return knex.from('refresh').insert(user)
		.catch((error) => KnexError(error));
};

/**
 * Function that removes a user's refresh token from the database.
 * @param {Object} userID - The id of the user
 * @returns {integer} - The number of rows deleted by the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delById = async function delById(userID) {
	return knex.from('refresh').del().where({ userID })
		.catch((error) => KnexError(error));
};
