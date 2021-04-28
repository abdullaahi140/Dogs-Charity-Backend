/**
 * A module to defines routes for users in the API.
 * @module routes/users
 * @author Abdullaahi Farah
 * @see routes/* for other routes in the API
 */

const uploadOptions = {
	multipart: true,
	formidable: {
		uploadDir: 'tmp/api/uploads'
	}
};

const Router = require('koa-router');
const koaBody = require('koa-body')(uploadOptions);

const userModel = require('../models/users.js');
const roleModel = require('../models/roles.js');
const refreshModel = require('../models/refresh.js');
const locationsModel = require('../models/locations.js');
const staffLocationsModel = require('../models/staff_locations.js');

const hashPassword = require('../helpers/hashPassword.js');
const jwt = require('../helpers/jwtToken.js');
const { auth } = require('../controllers/auth.js');

const imageUpload = require('../controllers/image_upload.js');
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
 *
 * @param {number} staffID - The staff's ID number
 * @param {number} staffCode - The staff code for a shelter location
 * @returns {boolean} - Boolean on success of getting location and adding staff ID
 */
// eslint-disable-next-line consistent-return
async function checkStaffRole(staffID, staffCode) {
	let result = await locationsModel.getByStaffCode(staffCode);
	if (result.length) {
		const locationID = result[0].ID;
		result = await staffLocationsModel.add(staffID, locationID);
		return true;
	}
	return false;
}

/**
 * Route that gets all users from the database
 * @param {Object} ctx - The Koa request/response context object
 */
async function createUser(ctx, next) {
	let ID;
	let role = 'user';
	const { staffCode, ...body } = await hashPassword(ctx.request.body);

	try {
		let result = await userModel.add(body);
		if (result.length) {
			[ID] = result; // setting ID to first element in result
			// check for staff role using staffCode to find chairty location
			if (staffCode && await checkStaffRole(ID, staffCode)) {
				role = 'staff';
			}
			const userWithRole = { role, userID: ID };
			result = await roleModel.add(userWithRole);
		}

		const accessToken = await jwt.genJwtAccessToken(ID, body.username);
		const userRefresh = await jwt.genJwtRefreshToken(ID, body.username);
		if (result.length) {
			result = await refreshModel.add(userRefresh);
		}

		if (result.length) {
			const link = `${ctx.protocol}://${ctx.request.header.host}${ctx.originalUrl}/${ID}`;
			ctx.body = {
				ID,
				created: true,
				accessToken,
				refreshToken: userRefresh,
				links: { account: link }
			};
			ctx.status = 201;
			await next();
		}
	} catch (err) {
		ctx.body = { created: false };
		if (err.code === 'ER_DUP_ENTRY') {
			ctx.body.message = 'Username is already taken';
		}
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
				links: link
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
router.post('/', koaBody, valUser, createUser, imageUpload);
router.put('/:ID([0-9]{1,})', auth, koaBody, valUserUpdate, updateUser);
router.del('/:ID([0-9]{1,})', auth, koaBody, deleteUser);

module.exports = router;
