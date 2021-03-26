const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const userModel = require('../models/users.js');
const roleModel = require('../models/roles.js')
const hashPassword = require('../helpers/hashPassword.js');
const auth = require('../controllers/auth.js');

// Adding URI prefix
const router = Router({ prefix: '/api/v1/users' })

router.get('/', auth, getAll);
router.get('/:id([0-9]{1,})', auth, getById);
router.post('/', bodyParser(), createUser);
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

async function getAll(ctx) {
	const result = await userModel.getAll();
	if (result.length) {
		ctx.body = result;
	}
}

async function getById(ctx) {
	const id = ctx.params.id;
	const result = await userModel.getById(id);
	if (result.length) {
		ctx.body = result[0];
	} else {
		ctx.status = 404;
	}
}

async function createUser(ctx) {
	const { role, ...body } = await hashPassword(ctx.request.body);
	const userWithRole = {role: role}
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
	let result = await userModel.getById(id);
	if (result.length) {
		let body = ctx.request.body
		if (body.password) {
			body = await hashPassword(body);
		}
		result = await userModel.update(result[0].ID, body);
	}
	if (result) {
		ctx.body = { ID: id };
	} else {
		ctx.status = 404;
	}
}

async function deleteUser(ctx) {
	const id = ctx.params.id;
	let result = await userModel.getById(id);
	if (result.length) {
		result = await userModel.delById(id);
		ctx.body = { affectedRows: result }
	} else {
		ctx.status = 404;
	}
}

module.exports = router;