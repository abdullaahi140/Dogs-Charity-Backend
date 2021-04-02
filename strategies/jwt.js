/**
 * A module for JWT authentication middleware using Passport.
 * @module strategies/jwt
 * @author Abdullaahi Farah
 * @see strategies/* for other Passport.js strategies
 */

const jwt = require('passport-jwt');
const model = require('../models/users.js');
require('dotenv').config();

/**
 * Function that verifies a JWT and checks the user in the token.
 * @param {string} jwtPayload - The decoded JWT with the user information
 * @param {Object} done - Passport.js method to implement strategy
 * @returns {function} - A callback function with the authenticated user or null
 */
const checkJWT = async function checkJWT(jwtPayload, done) {
	const { name: username, provider } = jwtPayload;
	const result = await model.getByUsername(username, provider);

	if (result.length) {
		const user = result[0];
		return done(null, user); // user is authenticated
	}
	return done(null, false); // token is invalid
};

/**
 * passport-jwt Options object
 * @type {jwt.StrategyOptions}
 */
const options = {
	// eslint-disable-next-line new-cap
	jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_ACCESS_SECRET,
	issuer: process.env.SERVER_NAME
};

module.exports = new jwt.Strategy(options, checkJWT);
