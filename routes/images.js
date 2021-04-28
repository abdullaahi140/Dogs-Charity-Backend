/**
 * A module to defines routes for getting images from the API.
 * @module routes/chats
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');
const { createReadStream, existsSync } = require('fs');

const model = require('../models/images');

/**
 * Route that gets images using ID from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function getById(ctx) {
	const { ID } = ctx.params;
	const result = await model.getById(ID);
	if (result.length) {
		const { filename, type } = result[0];
		const fileStore = `${__dirname}/../var/tmp/api/public/images`;
		const path = `${fileStore}/${filename}`;
		if (existsSync(path)) {
			const src = createReadStream(path);
			ctx.type = type;
			ctx.body = src;
		}
	} else {
		ctx.status = 404;
	}
}

const router = Router({ prefix: '/api/v1/images' });

router.get('/:ID([0-9]{1,})', getById);

module.exports = router;
