const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const userModel = require('../models/users.js');
const roleModel = require('../models/roles.js')
const hashPassword = require('../helpers/hashPassword.js');
const { auth } = require('../controllers/auth.js');
const can = require('../permissions/users.js');
require('dotenv').config()

// Adding URI prefix
const router = Router({ prefix: '/api/v1/users' })

router.get('/', auth, getAll);
router.get('/:id([0-9]{1,})', auth, bodyParser(), getById);
router.post('/', bodyParser(), createUser);
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateUser);
router.del('/:id([0-9]{1,})', auth, bodyParser(), deleteUser);

async function getAll(ctx) {
	const permission = await can.readAll(ctx.state.user);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const result = await userModel.getAll();
		if (result.length) {
			ctx.body = result;
		}
	}
}

async function getById(ctx) {
	const provider = ctx.request.body.provider;
	const permission = await can.read(ctx.state.user, ctx.params);
	if (!permission.granted) {
		ctx.status = 403;
	} else {
		const id = ctx.params.id;
		const user = await userModel.getById(id, provider);
		if (user.length) {
			ctx.body = permission.filter(user[0]);
		} else {
			ctx.status = 404;
		}
	}
}

async function createUser(ctx) {
	const { staffCode, ...body } = await hashPassword(ctx.request.body);
	// checking for staff code
	const role = (staffCode === process.env.STAFF_CODE) ? 'staff' : 'user';
	const userWithRole = { role: role }

	let id;
	let result = await userModel.add(body);
	if (result.length) {
		id = result[0];
		ctx.status = 201;
		userWithRole.userID = id;
		result = await roleModel.add(userWithRole);
	}

	if (result.length) {
		ctx.body = { ID: id };
	} else {
		ctx.status = 404;
	}
}

async function updateUser(ctx) {
	const id = ctx.params.id;
	const provider = ctx.request.body.provider
	let result = await userModel.getById(id, provider);
	if (result.length) {
		let body = ctx.request.body
		if (body.password) {
			body = await hashPassword(body);
		}
		result = await userModel.update(result[0].ID, body, provider);
	}
	if (result) {
		ctx.body = { ID: id };
	} else {
		ctx.status = 404;
	}
}

async function deleteUser(ctx) {
	const id = ctx.params.id;
	const provider = ctx.request.body.provider
	let result = await userModel.getById(id, provider);
	if (result.length) {
		result = await userModel.delById(id, provider);
		ctx.body = { affectedRows: result }
	} else {
		ctx.status = 404;
	}
}

module.exports = router;