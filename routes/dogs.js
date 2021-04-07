/**
 * A module to defines routes for dogs in the API.
 * @module routes/dogs
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const dogsModel = require('../models/dogs.js');
const dogLocationsModel = require('../models/dog_locations.js');

const { valDog, valDogUpdate } = require('../controllers/validation.js');
const { auth } = require('../controllers/auth.js');
const can = require('../permissions/dogs.js');

/**
 * Route that gets a dog by their ID from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function getById(ctx) {
	const { ID } = ctx.params;
	let dog = await dogsModel.getById(ID);
	if (dog.length) {
		[dog] = dog; // array destructuring to get a single dog
		ctx.body = dog;
	} else {
		ctx.status = 404;
	}
}

/**
 * Route that gets all dog or dogs matching a name and/or breed.
 * @param {Object} ctx - The Koa request/response context object
 */
async function getDogs(ctx) {
	let result;
	const { name, breed } = ctx.query;

	if (name || breed) {
		// if name is undefined then pass an empty string
		result = await dogsModel.searchDogs(name || '', breed);
	} else {
		// if there are no query params send a list of all dogs
		result = await dogsModel.getAll();
	}

	if (result.length) {
		ctx.body = result;
	}
}

/**
 * Route that gets adds a dog to the API.
 * @param {Object} ctx - The Koa request/response context object
 */
async function createDog(ctx) {
	const permission = await can.create(ctx.state.user);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const { locationID } = ctx.state.user;
		let result;
		let ID;

		if (locationID) {
			result = await dogsModel.add(ctx.request.body);
			if (result.length) {
				[ID] = result; // setting ID to first element in result
				const dogWithLocation = { dogID: ID, locationID };
				result = await dogLocationsModel.add(dogWithLocation);
			}
		}

		if (result.length) {
			const link = `${ctx.protocol}://${ctx.request.header.host}${ctx.originalUrl}${ID}`;
			ctx.body = {
				ID,
				created: true,
				link
			};
			ctx.status = 201;
		}
	}
}

/**
 * Route that gets updates a dog in the API.
 * @param {Object} ctx - The Koa request/response context object
 */
async function updateDog(ctx) {
	const { ID } = ctx.params;
	let result = await dogsModel.getById(ID);
	if (!result.length) {
		ctx.body = { updated: false };
		ctx.status = 404;
		return; // prevent permissions from being checked
	}

	const permission = await can.update(ctx.state.user, result[0]);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		if (result.length) {
			const body = permission.filter(ctx.request.body);
			result = await dogsModel.update(ID, body);
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
 * Route that deletes a dog from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function deleteDog(ctx) {
	const { ID } = ctx.params;
	let result = await dogsModel.getById(ID);
	if (!result.length) {
		ctx.body = { deleted: false };
		ctx.status = 404;
		return; // prevent permissions from being checked
	}

	const permission = await can.deleteDog(ctx.state.user, result[0]);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		result = await dogsModel.delById(ID);
		if (result) {
			ctx.body = { ID, deleted: true };
		}
	}
}

// Adding URI prefix
const router = Router({ prefix: '/api/v1/dogs' });

router.get('/', getDogs);
router.post('/', auth, bodyParser(), valDog, createDog);
router.get('/:ID([0-9]{1,})', getById);
router.put('/:ID([0-9]{1,})', auth, bodyParser(), valDogUpdate, updateDog);
router.del('/:ID([0-9]{1,})', auth, deleteDog);

module.exports = router;
