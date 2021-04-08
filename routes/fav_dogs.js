/**
 * A module to defines routes for favouriting dogs in the API.
 * @module routes/fav_dogs
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');

const dogsModel = require('../models/dogs.js');
const dogFavModel = require('../models/dog_favourites.js');

const { auth } = require('../controllers/auth.js');

/**
 * Route that gets a user's favourite dogs from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function getFavDog(ctx) {
	const { ID } = ctx.state.user;
	let result = await dogFavModel.getByUserId(ID);
	if (result.length) {
		result = await Promise.all(result.map(async (item) => {
			const dog = await dogsModel.getById(item.dogID);
			return dog[0];
		}));
		ctx.body = result;
	}
}

/**
 * Route that add a favourite dogs for a user
 * @param {Object} ctx - The Koa request/response context object
 */
async function addFavDog(ctx) {
	const { ID: userID } = ctx.state.user;
	const { ID: dogID } = ctx.params;
	try {
		const result = await dogFavModel.add(userID, dogID);
		if (result.length) {
			ctx.status = 201;
			ctx.body = { created: true };
		}
	} catch (error) {
		ctx.status = 404;
		ctx.body = { created: false };
	}
}

/**
 * Route that deletes a favourite dogs for a user
 * @param {Object} ctx - The Koa request/response context object
 */
async function delFavDog(ctx) {
	const { ID: userID } = ctx.state.user;
	const { ID: dogID } = ctx.params;
	const result = await dogFavModel.delFavDog(userID, dogID);
	if (result === 1) {
		ctx.status = 201;
		ctx.body = { deleted: true };
	} else {
		ctx.status = 404;
		ctx.body = { deleted: false };
	}
}

const router = Router({ prefix: '/api/v1/dogs/fav' });

router.get('/', auth, getFavDog);
router.post('/:ID([0-9]{1,})', auth, addFavDog);
router.del('/:ID([0-9]{1,})', auth, delFavDog);

module.exports = router;
