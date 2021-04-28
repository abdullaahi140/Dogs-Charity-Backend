/**
 * A module to defines routes for the authentication in the API.
 * @module routes/authenticate
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');

const { auth, googleAuth } = require('../controllers/auth.js');

const model = require('../models/refresh.js');
const jwt = require('../helpers/jwtToken.js');

/**
 * Function that generates JWTs after successful authentication
 * @param {Object} ctx - The Koa request/response context object
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 */
async function genTokens(ctx, provider = 'internal') {
	const { ID, username } = ctx.state.user;
	const accessToken = await jwt.genJwtAccessToken(ID, username, provider);

	let result = await model.getById(ID);
	let userRefresh;
	if (result.length) {
		const { userID, refresh_token: token } = result[0];
		userRefresh = { userID, token };
	} else {
		userRefresh = await jwt.genJwtRefreshToken(ID, username, provider);
		result = await model.add(userRefresh);
	}

	if (accessToken && result.length) {
		ctx.status = 201;
		ctx.body = {
			user: ctx.state.user,
			accessToken,
			refreshToken: userRefresh
		};
	}
}

/**
 * Route to authenticate a user using Basic Authentication or JWTs
 * @param {Object} ctx - The Koa request/response context object
 */
async function login(ctx) {
	await genTokens(ctx);
}

/**
 * Route to logout a user from the API and remove their refresh tokens
 * @param {Object} ctx - The Koa request/response context object
 */
async function logout(ctx) {
	const { ID } = ctx.state.user;
	if (ctx.state.user.ID === parseInt(ID, 10)) {
		const result = await model.delById(ID);
		ctx.state.user = {};
		if (result === 1) {
			ctx.body = { affectedRows: result, loggedOut: true };
		}
	}
}

/**
 * Route to refresh an access token using the refresh token in the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function refresh(ctx) {
	const { ID } = ctx.params;
	const result = await model.getById(ID);
	if (result.length) {
		const accessToken = await jwt.checkRefreshToken(result[0]);
		if (accessToken) {
			ctx.status = 201;
			ctx.body = { accessToken };
		}
	}
}

/**
 * Route called by Google when a user successfully authenticates using Google
 * @param {Object} ctx - The Koa request/response context object
 */
async function googleCallback(ctx) {
	await genTokens(ctx, 'google');
}

// Adding URI prefix
const router = new Router({ prefix: '/api/v1/auth' });

// Authentication for internal accounts
router.post('/login', auth, login);
router.post('/logout', auth, logout);
router.get('/refresh/:ID([0-9]{1,})', refresh);

// Authentication for Google accounts
router.get('/google', googleAuth);
router.get('/google/callback', googleAuth, googleCallback);

module.exports = router;
