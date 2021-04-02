/**
 * A module to manipulate data in the users table from the database.
 * @module models/users
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets all users from the database.
 * @returns {Array<Object>} - Array of user objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getAll = async function getAll() {
	return knex.from('users').select('users.*', 'roles.role')
		.leftJoin('roles', 'users.ID', 'roles.userID')
		.catch((error) => KnexError(error));
};

/**
 * Function that gets user using ID.
 * @param {string} id - ID of the user
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Object} - Object with user's information
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(id, provider = 'internal') {
	return knex.from('users').select('users.*', 'roles.role')
		.where({ ID: id, provider })
		.leftJoin('roles', 'users.ID', 'roles.userID')
		.catch((error) => KnexError(error));
};

/**
 * Function that gets user using username.
 * @param {string} username - username of the user
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Object} - Object with user's information
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getByUsername = async function getByUsername(username, provider = 'internal') {
	return knex.from('users').select('users.*', 'roles.role')
		.where({ username, provider })
		.leftJoin('roles', 'users.ID', 'roles.userID')
		.catch((error) => KnexError(error));
};

/**
 * Function gets a user or adds them if not present in the database.
 * @param {Object} user - Object with user's information
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Object} - Object with user's information
 */
exports.getOrAdd = async function getOrAdd(user, provider = 'internal') {
	// Check if user is in database
	let result = await module.exports.getByUsername(user.username, provider);
	if (result.length) {
		return result;
	}

	// Add user if not present in database
	const data = await module.exports.add(user, user.provider);
	if (data.length) {
		const id = data[0];
		result = await module.exports.getById(id, user.provider);
		return result;
	}
	return false;
};

/**
 * Function that adds user to the database.
 * @param {Object} user - Object with user's information
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(user, provider = 'internal') {
	const userToAdd = Object.assign(user, { provider });
	return knex.from('users').insert(userToAdd)
		.catch((error) => KnexError(error));
};

/**
 * Function that updates user in the database.
 * @param {string} id - ID of the user
 * @param {Object} user - Object with user's information
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Array} - Array with ID's of users updated
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.update = async function update(id, user, provider = 'internal') {
	return knex.from('users').update(user).where({ ID: id, provider })
		.catch((error) => KnexError(error));
};

/**
 * Function that removes a user from the database.
 * @param {Object} id - The id of the user
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {integer} - The number of rows deleted by the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delById = async function delById(id, provider = 'internal') {
	return knex.from('users').del().where({ ID: id, provider })
		.catch((error) => KnexError(error));
};
