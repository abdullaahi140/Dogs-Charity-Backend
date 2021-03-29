const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const { auth, googleAuth } = require('../controllers/auth.js');
// const googleAuth = require('../controllers/googleAuth.js');

const model = require('../models/refresh.js');
const jwt = require('../helpers/jwtToken.js');

// Adding URI prefix
const router = new Router({ prefix: '/api/v1/auth' });

// Authentication for internal accounts
router.post('/login', bodyParser(), auth, login);
router.get('/logout/:id([0-9]{1,})', auth, logout);
router.get('/refresh/:id([0-9]{1,})', refresh);

// Authentication for Google accounts
router.get('/google', googleAuth)
router.get('/google/callback', googleAuth, googleCallback)

async function genTokens(ctx, provider = 'internal') {
	const { ID, username } = ctx.state.user;
	const accessToken = await jwt.genJwtAccessToken(ID, username, provider);
	const userRefresh = await jwt.genJwtRefreshToken(ID, username, provider);

	try {
		await model.add(userRefresh);
	} catch (err) {
		console.error('Refresh token already exists')
	}
	if (accessToken) {
		ctx.status = 201;
		ctx.body = { accessToken: accessToken };
	} else {
		ctx.status = 404;
	}
}

async function login(ctx) {
	try {
		await genTokens(ctx);
	} catch (err) {
		ctx.status = 404;
	}
}

async function logout(ctx) {
	const id = ctx.params.id;
	if (ctx.state.state.ID === id)
	const result = await model.delById(id);
	ctx.state.user = {};
	ctx.body = { affectedRows: result };
}

async function refresh(ctx) {
	const id = ctx.params.id;
	let result = await model.getById(id);
	if (result.length) {
		const accessToken = await jwt.checkRefreshToken(result[0]);
		if (accessToken) {
			ctx.body = { access: accessToken }
		}
	} else {
		ctx.status = 404;
	}
}

async function googleCallback(ctx) {
	ctx.body = ctx.state.user;
	try {
		await genTokens(ctx, 'google');
	} catch (err) {
		ctx.status = 404;
	}
}

module.exports = router;
