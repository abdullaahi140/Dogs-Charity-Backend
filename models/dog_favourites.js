/**
 * A module to manipulate data in the dog_favourites table from the database.
 * @module models/dog_locations
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets a user's favourite dog using userID and dogID.
 * @param {number} userID - The user's ID number
 * @param {number} dogID - The user's ID number
 * @returns {Array} - Array with objects of favourite dogs
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getByDogId = async function getByDogId(userID, dogID) {
	return knex.from('dog_favourites').select('dogID').where({ userID, dogID })
		.catch((error) => KnexError(error));
};

/**
 * Function that gets a user's favourite dogs using userID.
 * @param {number} userID - The user's ID number
 * @returns {Array} - Array with objects of favourite dogs
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getByUserId = async function getByUserId(userID) {
	return knex.from('dog_favourites').select('dogID').where({ userID })
		.catch((error) => KnexError(error));
};

/**
 * Function that adds a user's favourite dog to the database.
 * @param {number} userID - The user's ID number
 * @param {number} dogID - The favourite dog's ID number
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(userID, dogID) {
	return knex.from('dog_favourites').insert({ userID, dogID })
		.catch((error) => KnexError(error));
};

/**
 * Function that deletes a user's favourite dogs to the database.
 * @param {number} userID - The user's ID number
 * @param {number} dogID - The favourite dog's ID number
 * @returns {number} - The number of rows deleted from the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delFavDog = async function delById(userID, dogID) {
	return knex.from('dog_favourites').del().where({ userID, dogID })
		.catch((error) => KnexError(error));
};
