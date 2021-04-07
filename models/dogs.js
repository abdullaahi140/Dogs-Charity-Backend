/**
 * A module to manipulate data in the dogs table from the database.
 * @module models/dogs
 * @author Abdullaahi Farah
 * @see database/* for database management files
 */

const { knex, KnexError } = require('../database/knex.js');

/**
 * Function that gets all dogs from the database.
 * @returns {Array<Object>} - Array of user objects
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getAll = async function getAll() {
	return knex.from('dogs').select('dogs.*', 'dog_locations.locationID')
		.leftJoin('dog_locations', 'dogs.ID', 'dog_locations.dogID')
		.catch((error) => KnexError(error));
};

/**
 * Function that gets dogs using ID.
 * @param {string} ID - ID of the dog
 * @returns {Object} - Object with dogs's information
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getById = async function getById(ID) {
	return knex.from('dogs').select('dogs.*', 'dog_locations.locationID')
		.where('dogs.ID', ID)
		.leftJoin('dog_locations', 'dogs.ID', 'dog_locations.dogID')
		.catch((error) => KnexError(error));
};

/**
 * Function that gets dogs using name.
 * @param {string} name - name of the dog
 * @returns {Array<Object>} - Array with objects of dogss with matching name
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.getByName = async function getByName(name) {
	return knex.from('dogs').select('dogs.*', 'dog_locations.locationID')
		.where('dogs.name', name)
		.leftJoin('dog_locations', 'dogs.ID', 'dog_locations.dogID')
		.catch((error) => KnexError(error));
};

/**
 * Function that searches for dogs using name or breed.
 * @param {string} name - name of the dog
 * @param {string} breed - breed of the dog
 * @returns {Array<Object>} - Array with objects of dogss with matching name or breed
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.searchDogs = async function searchDogs(name, breed) {
	return knex.from('dogs').select('dogs.*', 'dog_locations.locationID')
		.where('dogs.name', 'like', `${name}%`)
		.andWhere(function checkBreed() {
			if (breed) this.where({ breed }); // only search breed if it is defined
		})
		.leftJoin('dog_locations', 'dogs.ID', 'dog_locations.dogID')
		.catch((error) => KnexError(error));
};

/**
 * Function that adds dogs to the database.
 * @param {Object} user - Object with dog's information
 * @returns {Array} - Array with ID's of users added
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.add = async function add(dog) {
	return knex.from('dogs').insert(dog)
		.catch((error) => KnexError(error));
};

/**
 * Function that updates user in the database.
 * @param {string} ID - ID of the dog
 * @returns {Array} - Array with ID's of users updated
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.update = async function update(ID, dog) {
	return knex.from('dogs').update(dog).where({ ID })
		.catch((error) => KnexError(error));
};

/**
 * Function that removes a user from the database.
 * @param {Object} ID - The ID of the dog
 * @returns {integer} - The number of rows deleted by the database
 * @throws {KnexError} - Re-raise and sanitise DB errors
 */
exports.delById = async function delById(ID) {
	return knex.from('dogs').del().where({ ID })
		.catch((error) => KnexError(error));
};
