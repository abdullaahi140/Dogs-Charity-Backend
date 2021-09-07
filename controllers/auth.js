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
exports.auth = async (ctx, next) => (passport.authenticate(['jwt', 'basic'], { session: false }, async (error, user, info) => {
	if (info) {
		let [errorInfo] = info;
		if (Object.keys(info[0]).length === 0) {
			errorInfo = {
				name: 'AuthenticationError',
				message: 'Incorrect username or password'
			};
		}
		ctx.status = 401;
		// 1st array element has JWT error info
		ctx.body = errorInfo;
		return;
	}

	if (error || !user) {
		ctx.throw(401, 'Unauthorized');
	}

	// set the user object to state in Koa context
	ctx.state.user = user;
	await next();
}))(ctx, next);

// Export google authentication for use only on initial login
exports.googleAuth = passport.authenticate(['google'], {
	session: false,
	scope: ['profile', 'email'],
	accessType: 'offline',
	prompt: 'consent'
});
