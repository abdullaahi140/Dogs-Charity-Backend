const passport = require('koa-passport');
const google = require('../strategies/google.js');

passport.use(google);

module.exports = passport.authenticate(['google'], {
	session: false, 
	scope: ['profile', 'email'],
	accessType: 'offline',
	prompt: 'consent'
});
