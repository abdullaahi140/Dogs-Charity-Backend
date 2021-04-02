/**
 * A module to check permission for users interacting with other users in the database.
 * @module permissions/users
 * @author Abdullaahi Farah
 * @see permissions/* for other permissions in the API
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

// User permissions
ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('read')
	.on('user', ['*', '!password', '!passwordSalt']);

ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('update')
	.on('user', ['username', 'firstName', 'lastName', 'password', 'passwordSalt', 'imgURL']);

ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('delete')
	.on('user');

// Staff permissions
ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('read')
	.on('user', ['*', '!password', '!passwordSalt']);

ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('update')
	.on('user', ['username', 'firstName', 'lastName', 'password', 'passwordSalt', 'imgURL']);

ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('delete')
	.on('user');

// Admin permissions
ac
	.grant('admin')
	.execute('read')
	.on('user', ['*', '!password', '!passwordSalt']);

ac
	.grant('admin')
	.execute('read')
	.on('users', ['*', '!password', '!passwordSalt']);

ac
	.grant('admin')
	.execute('update')
	.on('user');

ac
	.grant('admin')
	.condition({ Fn: 'NOT_EQUALS', args: { requester: '$.owner' } })
	.execute('delete')
	.on('user');

/**
 * Function that checks permissions for accessing all user details.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.readAll = async function readAll(requester) {
	return ac
		.can(requester.role)
		.execute('read')
		.on('users');
};

/**
 * Function that checks permissions for accessing a user's details.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.read = async function read(requester, data) {
	let { id } = data;
	id = parseInt(id, 10);
	return ac
		.can(requester.role)
		.context({ requester: requester.ID, owner: id })
		.execute('read')
		.on('user');
};

/**
 * Function that checks permissions for updating a user's details.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.update = async function update(requester, data) {
	let { id } = data;
	id = parseInt(id, 10);
	return ac
		.can(requester.role)
		.context({ requester: requester.ID, owner: id })
		.execute('update')
		.on('user');
};

/**
 * Function that checks permissions for deleting a user's details.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.deleteUser = async function deleteUser(requester, data) {
	let { id } = data;
	id = parseInt(id, 10);
	return ac
		.can(requester.role)
		.context({ requester: requester.ID, owner: id })
		.execute('delete')
		.on('user');
};
