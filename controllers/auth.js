const passport = require('koa-passport');
const basic = require('../strategies/basic.js');
const jwt = require('../strategies/jwt.js');

passport.use(basic);
passport.use(jwt);

exports.auth = passport.authenticate(['basic', 'jwt'], { session: false });
 
const google = require('../strategies/google.js');
passport.use(google);

exports.googleAuth = passport.authenticate(['google'], {
	session: false,
	scope: ['profile', 'email'],
	accessType: 'offline',
	prompt: 'consent'
});