const GoogleStrategy = require('passport-google-oauth20').Strategy;
const model = require('../models/users.js');
require('dotenv').config();

const checkGoogleAuth = async function (_accessToken, _refreshToken, profile, done) {
	// If Google auth fails
	if (!_accessToken || !_refreshToken || !profile) {
		return done(null, false)
	}
	
	const token = profile._json;
	let user = {
		username: token.email.split('@')[0],
		password: 'N/A',
		passwordSalt: 'N/A',
		imgURL: token.picture,
		firstName: token.given_name,
		lastName: token.family_name,
		provider: 'google'
	}

	try {
		user = await model.getOrAdd(user, user.provider);
		return done(null, user);
	} catch (err) {
		console.error(err);
		return done(null, false);
	}
}

const options = {
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: `http://localhost:${process.env.SERVER_PORT}/api/v1/auth/google/callback`
}

module.exports = new GoogleStrategy(options, checkGoogleAuth);
