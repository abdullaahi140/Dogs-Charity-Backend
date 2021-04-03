/**
 * A module to defines routes for users in the API.
 * @module routes/users
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const userModel = require('../models/users.js');
const roleModel = require('../models/roles.js');
const refreshModel = require('../models/refresh.js');

const hashPassword = require('../helpers/hashPassword.js');
const jwt = require('../helpers/jwtToken.js');
const { auth } = require('../controllers/auth.js');

const { valUser, valUserUpdate } = require('../controllers/validation.js');
const can = require('../permissions/users.js');
require('dotenv').config();

/**
 * Route that gets all users from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function getAll(ctx) {
	const permission = await can.readAll(ctx.state.user);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const result = await userModel.getAll();
		if (result.length) {
			ctx.body = permission.filter(result);
		}
	}
}

/**
 * Route that gets a user by their ID from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function getById(ctx) {
	const permission = await can.read(ctx.state.user, ctx.params);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const { provider } = ctx.state.user;
		const { ID } = ctx.params;
		const user = await userModel.getById(ID, provider);
		if (user.length) {
			ctx.body = permission.filter(user[0]);
		} else {
			ctx.status = 404;
		}
	}
}

/**
 * Route that gets all users from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function createUser(ctx) {
	const { staffCode, ...body } = await hashPassword(ctx.request.body);
	// checking for staff code
	const role = (staffCode === process.env.STAFF_CODE) ? 'staff' : 'user';
	const userWithRole = { role };

	let ID;
	try {
		let result = await userModel.add(body);
		if (result.length) {
			[ID] = result; // setting ID to first element in result
			ctx.status = 201;
			userWithRole.userID = ID;
			result = await roleModel.add(userWithRole);
		}

		const accessToken = await jwt.genJwtAccessToken(ID, body.username);
		if (result.length) {
			const userRefresh = await jwt.genJwtRefreshToken(ID, body.username);
			result = await refreshModel.add(userRefresh);
		}

		if (result.length) {
			const link = `${ctx.protocol}://${ctx.request.header.host}${ctx.originalUrl}`;
			ctx.body = {
				ID,
				created: true,
				accessToken,
				link
			};
		}
	} catch (error) {
		ctx.body = { created: false };
		ctx.status = 404;
	}
}

/**
 * Function that gets all users from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function updateUser(ctx) {
	const permission = await can.update(ctx.state.user, ctx.params);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const { ID } = ctx.params;
		const { provider } = ctx.request.body;
		let result = await userModel.getById(ID, provider);
		if (result.length) {
			let { body } = ctx.request;
			if (body.password) {
				body = await hashPassword(body);
			}
			body = permission.filter(body);
			result = await userModel.update(result[0].ID, body, provider);
		}
		if (result) {
			const link = `${ctx.protocol}://${ctx.request.header.host}${ctx.originalUrl}`;
			ctx.body = {
				ID,
				updated: true,
				link
			};
			ctx.status = 201;
		}
	}
}

/**
 * Route that deletes a user from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function deleteUser(ctx) {
	const permission = await can.deleteUser(ctx.state.user, ctx.params);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const { ID } = ctx.params;
		const { provider } = ctx.request.body;
		let result = await userModel.getById(ID, provider);
		if (result.length) {
			result = await userModel.delById(ID, provider);
			ctx.body = { ID, deleted: true };
		}
	}
}

// Adding URI prefix
const router = Router({ prefix: '/api/v1/users' });

router.get('/', auth, getAll);
router.get('/:ID([0-9]{1,})', auth, getById);
router.post('/', bodyParser(), valUser, createUser);
router.put('/:ID([0-9]{1,})', auth, bodyParser(), valUserUpdate, updateUser);
router.del('/:ID([0-9]{1,})', auth, bodyParser(), deleteUser);

module.exports = router;
