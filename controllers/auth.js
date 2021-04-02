/**
 * A module to authenicate users in routes of the API.
 * @module controllers/auth
 * @author Abdullaahi Farah
 * @see strategies/* for Passport.js strategies
 */

const passport = require('koa-passport');
const basic = require('../strategies/basic.js');
const jwt = require('../strategies/jwt.js');
const google = require('../strategies/google.js');

passport.use(basic);
passport.use(jwt);
passport.use(google);

// Export auth for all routes
exports.auth = passport.authenticate(['basic', 'jwt'], { session: false });
// Export google authentication for use only on initial login
exports.googleAuth = passport.authenticate(['google'], {
	session: false,
	scope: ['profile', 'email'],
	accessType: 'offline',
	prompt: 'consent'
});
