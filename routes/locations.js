/**
 * A module to defines routes for getting all shelter locations in the API.
 * @module routes/chats
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');
const model = require('../models/locations.js');
const { auth } = require('../controllers/auth.js');

/**
 * Route that gets all shelter locations
 * @param {Object} ctx - The Koa request/response context object
 */
async function getAll(ctx) {
	const { ID } = ctx.state.user;
	let result = await model.getAll(ID);
	result = result.filter((location) => location.ID !== 1); // remove admin shelter
	if (result.length) {
		ctx.body = result;
	}
}

/**
 * Route that a shelter location using the ID
 * @param {Object} ctx - The Koa request/response context object
 */
async function getById(ctx) {
	const { ID } = ctx.params;
	const result = await model.getById(ID);
	if (result.length) {
		const [location] = result;
		ctx.body = location;
	}
}

const router = Router({ prefix: '/api/v1/locations' });

router.get('/', auth, getAll);
router.get('/:ID([0-9]{1,})', auth, getById);

module.exports = router;
