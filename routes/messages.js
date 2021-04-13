/**
 * A module to defines routes for starting chats in the API.
 * @module routes/chats
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const messagesModel = require('../models/messages.js');
const chatsModel = require('../models/chats.js');

const { valMessage } = require('../controllers/validation.js');
const { auth } = require('../controllers/auth.js');
const can = require('../permissions/messages.js');

/**
 * Route that gets all messages for a chat in the API.
 * @param {Object} ctx - The Koa request/response context object
 */
async function getAll(ctx) {
	const { chatID } = ctx.params;
	let result = await chatsModel.getById(chatID);
	if (result.length) {
		const permission = await can.readMessages(ctx.state.user, result[0]);
		if (!permission.granted) {
			ctx.status = 403;
		} else {
			result = await messagesModel.getAllByChatId(chatID);
			if (result.length) {
				ctx.body = result;
			}
		}
	}
}

/**
 * Route that creates a message to a chat.
 * @param {Object} ctx - The Koa request/response context object
 */
async function addMessage(ctx) {
	const { chatID } = ctx.params;
	let result = await chatsModel.getById(chatID);
	if (result.length) {
		const permission = await can.createMessage(ctx.state.user, result[0]);
		if (!permission.granted) {
			ctx.status = 403;
		} else {
			const message = {
				chatID,
				senderID: ctx.state.user.ID,
				...ctx.request.body
			};
			result = await messagesModel.add(message);
			ctx.status = 201;
			ctx.body = {
				ID: result[0],
				created: true
			};
		}
	} else {
		ctx.status = 404;
		ctx.body = { created: false };
	}
}

/**
 * Route that deletes a message from a chat.
 * @param {Object} ctx - The Koa request/response context object
 */
async function deleteMessage(ctx) {
	const { ID } = ctx.params;
	let result = await messagesModel.getById(ID);
	if (!result.length) {
		ctx.body = { deleted: false };
		ctx.status = 404;
	} else {
		const chat = await chatsModel.getById(result[0].chatID);
		const permission = await can.deleteMessage(ctx.state.user, result[0], chat[0]);
		if (!permission.granted) {
			ctx.status = 403;
		} else {
			result = await messagesModel.delById(ID);
			if (result) {
				ctx.body = { deleted: true };
			}
		}
	}
}

const router = Router({ prefix: '/api/v1/messages' });

router.get('/:chatID([0-9]{1,})', auth, getAll);
router.post('/:chatID([0-9]{1,})', auth, bodyParser(), valMessage, addMessage);
router.del('/:ID([0-9]{1,})', auth, deleteMessage);

module.exports = router;
