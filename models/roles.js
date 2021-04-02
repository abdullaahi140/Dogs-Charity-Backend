/**
 * A module to manipulate data in the roles table from the database.
 * @module models/roles
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */
const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that adds a user with their role to the database.
 * @param {Object} user - Object with the user's ID and role
 * @returns {Array} - User IDs of the rows added to the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(userWithRole) {
	return knex.from('roles').insert(userWithRole)
		.catch((error) => KnexError(error));
};
