const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users =  require('../models/users.js');
require('dotenv').config()

const checkUserAndPass = async (jwt_payload, done) => {
	let result;
	const username = jwt_payload.name;

	try {
		result = await users.getByUsername(username);
	} catch (err) {
		console.error(`Error during authentication for ${username}`);
		return done(error)
	}

	if (result.length) {
		const user = result[0];
		return done(null, user);
	} else {
		return done(null, false); // credentails are incorrect
	}
}

const options = {
	'jwtFromRequest': new ExtractJwt.fromAuthHeaderAsBearerToken(),
	'secretOrKey': process.env.JWT_ACCESS_SECRET,
}

module.exports = new JwtStrategy(options, checkUserAndPass);
