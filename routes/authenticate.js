const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const auth = require('../controllers/auth');
const model = require('../models/refresh.js');
const jwt = require('../helpers/jwtToken.js')

// Adding URI prefix
const router = new Router({ prefix: '/api/v1/auth' });

router.post('/login', auth, bodyParser(), login);
router.post('/logout/:id([0-9]{1,})', auth, logout);
router.put('/refresh/:id([0-9]{1,})', auth, refresh);

async function login(ctx) {
	const { ID, username } = ctx.state.user;
	const access_token = await jwt.genJwtAccessToken(ID, username);
	const user_refresh = await jwt.genJwtRefreshToken(ID, username);

	result = await model.add(user_refresh);
	if (result.length) {
		ctx.status = 201;
		ctx.body = { access: access_token };
	} else {
		ctx.status = 404;
	}
}

async function logout(ctx) {
	const id = ctx.params.id;
	const result = await model.delById(id);
	ctx.body = { affectedRows: result };
}

async function refresh(ctx) {
	const id = ctx.params.id;
	let result = await model.getById(id);
	if (result.length) {
		const access_token = await jwt.checkRefreshToken(result[0]);
		if (access_token) {
			ctx.body = { access: access_token }
		}
	} else {
		ctx.status = 404;
	}
}

module.exports = router;
