const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const model = require('../models/users.js');
require('dotenv').config()

const checkJwtToken = async function (jwt_payload, done) {
	let result;
	const { name: username, provider } = jwt_payload;

	try {
		result = await model.getByUsername(username, provider);
	} catch (error) {
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

module.exports = new JwtStrategy(options, checkJwtToken);
