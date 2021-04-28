/**
 * A module for Basic Authentication middleware using Passport.
 * @module strategies/basic
 * @author Abdullaahi Farah
 * @see strategies/* for other Passport.js strategies
 */

const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcryptjs');
const users = require('../models/users.js');

/**
 * Function that checks a user account account exists using credentials.
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @param {Object} done - Passport.js method to implement strategy
 * @returns {function} - A callback function with the authenticated user or null
 */
const checkCredentials = async function checkCredentials(username, password, done) {
	const result = await users.getByUsername(username);
	if (!result.length) {
		return done(null, false); // username is incorrect
	}

	const user = result[0];
	const checkPassword = await bcrypt.compare(password, user.password);
	if (checkPassword) {
		return done(null, user); // user is authenticated
	}

	return done(null, false); // password is incorrect
};

module.exports = new BasicStrategy(checkCredentials);
