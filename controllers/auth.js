const passport = require('koa-passport');
const basic = require('../strategies/basic.js');
const jwt = require('../strategies/jwt.js');

passport.use(basic);
passport.use(jwt)

module.exports = passport.authenticate(['basic', 'jwt'], { session: false });
