/**
 * A module to defines routes for starting chats in the API.
 * @module routes/chats
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');

const model = require('../models/chats.js');

const { auth } = require('../controllers/auth.js');
const can = require('../permissions/chats.js');

/**
 * Route that gets all chats of the authenticated user
 * @param {Object} ctx - The Koa request/response context object
 */
async function getAll(ctx) {
	const { ID } = ctx.state.user;
	const result = await model.getAll(ID);
	if (result.length) {
		ctx.body = result;
	}
}

/**
 * Route that gets all chats for a shelter location. Visible to staff and admins only.
 * @param {Object} ctx - The Koa request/response context object
 */
async function getAllByLocationId(ctx) {
	const permission = await can.readByLocationId(ctx.state.user, ctx.params);
	if (permission.granted) {
		const { locationID } = ctx.params;
		const result = await model.getAllByLocationId(locationID);
		if (result.length) {
			ctx.body = result;
		}
	} else {
		ctx.status = 403;
	}
}

/**
 * Route that creates a chat to a shelter location in the API.
 * @param {Object} ctx - The Koa request/response context object
 */
async function createChat(ctx) {
	const { ID } = ctx.state.user;
	const { locationID } = ctx.params;
	try {
		const result = await model.add(ID, locationID);
		if (result.length) {
			ctx.status = 201;
			const link = `${ctx.protocol}://${ctx.request.header.host}/api/v1/messages/${result[0]}`;
			ctx.body = {
				ID: result[0],
				created: true,
				link
			};
		}
	} catch (error) {
		ctx.status = 404;
		ctx.body = { created: false };
	}
}

/**
 * Route that deletes a chat from the API.
 * @param {Object} ctx - The Koa request/response context object
 */
async function delChat(ctx) {
	const { ID } = ctx.params;
	let result = await model.getById(ID);
	if (!result.length) {
		ctx.body = { deleted: false };
		ctx.status = 404;
	} else {
		const permission = await can.deleteChat(ctx.state.user, result[0]);
		if (!permission.granted) {
			ctx.status = 403;
		} else {
			result = await model.delById(ID);
			if (result) {
				ctx.body = { deleted: true };
			}
		}
	}
}

const router = Router({ prefix: '/api/v1/chats' });

router.get('/', auth, getAll);
router.get('/:locationID([0-9]{1,})', auth, getAllByLocationId);
router.post('/:locationID([0-9]{1,})', auth, createChat);
router.del('/:ID([0-9]{1,})', auth, delChat);

module.exports = router;
