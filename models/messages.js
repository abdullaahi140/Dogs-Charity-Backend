/**
 * A module to manipulate data in the messages table from the database.
 * @module models/messages
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets all messages from a chat in the database.
 * @returns {Array<Object>} - Array of user objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getAllByChatId = async function getAllByChatId(chatID) {
	return knex.from('messages').select('*').where({ chatID })
		.catch((error) => KnexError(error));
};

/**
 * Function that gets a message using the ID in the database.
 * @returns {Array<Object>} - Array of user objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(ID) {
	return knex.from('messages').select('*').where({ ID })
		.catch((error) => KnexError(error));
};

/**
 * Function that adds a message to the database.
 * @param {Object} message - Object with a message
 * @returns {Array} - Array with ID's of messages added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(message) {
	return knex.from('messages').insert(message)
		.catch((error) => KnexError(error));
};

/**
 * Function that removes a message from the database.
 * @param {Object} ID - The message ID
 * @returns {number} - The number of rows deleted by the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delById = async function delById(ID) {
	return knex.from('messages').del().where({ ID })
		.catch((error) => KnexError(error));
};
