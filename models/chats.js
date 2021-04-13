/**
 * A module to manipulate data in the chats table from the database.
 * @module models/chats
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets chats from the database using the locationID number.
 * @param {number} locationID - The shelter location ID number
 * @returns {Array<Object>} - Array of chat objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getAllByLocationId = async function getById(locationID) {
	return knex.from('chats').select('*').where({ locationID })
		.catch((error) => KnexError(error));
};

/**
 * Function that gets chat from the database using an ID number.
 * @param {number} ID - The chat's ID number
 * @returns {Array<Object>} - Array of chat objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(ID) {
	return knex.from('chats').select('*').where({ ID })
		.catch((error) => KnexError(error));
};

/**
 * Function that gets all chats from the database.
 * @param {number} userID - The user's ID number
 * @returns {Array<Object>} - Array of chat objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getAll = async function getAll(userID) {
	return knex.from('chats').select('*').where({ userID })
		.catch((error) => KnexError(error));
};

/**
 * Function that adds a chat to the database.
 * @param {number} userID - The ID of the user
 * @param {number} locationID - The ID of the shelter
 * @returns {Array} - Array with ID's of messages added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(userID, locationID) {
	return knex.from('chats').insert({ userID, locationID })
		.catch((error) => KnexError(error));
};

/**
 * Function that removes a chat from the database.
 * @param {Object} ID - The chat ID
 * @returns {number} - The number of rows deleted by the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delById = async function delById(ID) {
	return knex.from('chats').del().where({ ID })
		.catch((error) => KnexError(error));
};
