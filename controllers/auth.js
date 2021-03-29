const passport = require('koa-passport');
const basic = require('../strategies/basic.js');
const jwt = require('../strategies/jwt.js');
const googleToken = require('../strategies/googleToken.js');

passport.use(basic);
passport.use(jwt);
passport.use(googleToken)

exports.auth = passport.authenticate(['basic', 'jwt', 'google-id-token'],
	{ session: false }
);

 
const google = require('../strategies/google.js');
passport.use(google);

exports.googleAuth = passport.authenticate(['google'], {
	session: false,
	scope: ['profile', 'email'],
	accessType: 'offline',
	prompt: 'consent'
});