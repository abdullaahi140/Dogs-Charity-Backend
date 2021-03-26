const BasicStrategy = require('passport-http').BasicStrategy;
const users =  require('../models/users.js');
const bcrypt = require('bcrypt');

const verifyPassword = async (user, password) => {
	// compare user.password with the password supplied
	return await bcrypt.compare(password, user.password);
}

const checkUserAndPass = async (username, password, done) => {
	// look up the user and check the password if the user exists
	// call done() with either an error or the user, depending on outcome
	let result;

	try {
		result = await users.getByUsername(username);
	} catch (err) {
		console.error(`Error during authentication for ${username}`);
		return done(err)
	}

	if (result.length) {
		const user = result[0];
		if (await verifyPassword(user, password)) {
			console.log(`Successfully authenticated user ${username}`);
			return done(null, user);
		} else {
			console.log(`Password incorrect for user ${username}`);
		}
	} else {
		console.log(`No user found with username ${username}`);
	}

	const guest = {'role': 'guest'}
	return done(null, guest); // username or password were incorrect
}

module.exports = new BasicStrategy(checkUserAndPass);
