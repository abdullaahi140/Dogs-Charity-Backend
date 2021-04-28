/**
 * A module used to hash passwords using bcrypt.
 * @module helpers/hashPassword
 * @author Abdullaahi Farah
 * @see helpers/* for other helper functions
 */

const bcrypt = require('bcryptjs');

/**
 * Function to hash a password using bcrypt.
 * @param {Object} body - JSON object with a plain password
 * @returns {Object} - A JSON object with hashed password and password salt
 */
async function hashPassword(body) {
	const mutatedBody = body;
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const password = await bcrypt.hash(body.password, salt);
	mutatedBody.passwordSalt = salt;
	mutatedBody.password = password;
	return mutatedBody;
}

module.exports = hashPassword;
