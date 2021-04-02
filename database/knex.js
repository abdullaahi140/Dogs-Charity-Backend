/**
 * A module to create a configured Knex object using ./knexfile.js
 * @module database/knex
 * @author Abdullaahi Farah
 * @see database/knexfile.js for database config options
 * @see database/migrations/* for database migration files
 * @see database/seeds/* for database seeds files
 */

const knex = require('knex');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('./knexfile.js');
require('dotenv').config();

/**
 * A custom error constructor to re-raise DB errors in a sanitised way.
 * @class
 * @param {string} message - the error message
 * @param {number|string} code - the original error's error code
 * @param {string} id - a UUID identifier for the error instanced
 */
function DatabaseException(error, errorID) {
	this.message = error.message;
	this.errorID = errorID;
	this.code = error.code;
	this.errno = error.errno;
	this.sqlState = error.sqlState;
	this.sqlMessage = error.sqlMessage;
	this.name = 'DatabaseException';
}

/**
 * Function that sanitises Knex errors and displays them in user-friendly format
 * @param {error} error - Error object made by Knex
 */
function KnexError(error) {
	const errorID = uuidv4();
	const consoleError = {
		date: Date.now(),
		errorID,
		code: error.code,
		sqlMessage: error.sqlMessage
	};
	// eslint-disable-next-line no-console
	console.error('\x1b[31m', 'DB ERROR: ', consoleError); // \x1b[31m - Red error text
	throw new DatabaseException(error);
}

// exports.knex = knex(development);
const config = knexfile[process.env.NODE_ENV];
exports.knex = knex(config);
exports.KnexError = KnexError;
