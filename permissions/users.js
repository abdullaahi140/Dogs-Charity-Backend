const AccessControl = require('role-acl');
const ac = new AccessControl();

// User permissions
ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
	.execute('read')
	.on('user', ['*', '!password', '!passwordSalt']);

ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
	.execute('update')
	.on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'imgURL', 'dateModified']);

// Staff permissions
ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
	.execute('read')
	.on('user', ['*', '!password', '!passwordSalt']);

ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
	.execute('update')
	.on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'imgURL', 'dateModified']);

// Admin permissions
ac
	.grant('admin')
	.execute('read')
	.on('user');

ac
	.grant('admin')
	.execute('read')
	.on('users');

ac
	.grant('admin')
	.execute('update')
	.on('user');

ac
	.grant('admin')
	.condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } })
	.execute('delete')
	.on('user');


exports.readAll = async function(requester) {
	return ac
		.can(requester.role)
		.execute('read')
		.on('users');
}

exports.read = async function(requester, data) {
	data.id = parseInt(data.id);
	return ac
		.can(requester.role)
		.context({ requester: requester.ID, owner: data.id })
		.execute('read')
		.on('user');
}

exports.update = async function(requester, data) {
	data.id = parseInt(data.id);
	return ac
		.can(requester.role)
		.context({ requester: requester.ID, owner: data.id })
		.execute('update')
		.on('user');
}

exports.deleteUser = async function(requester, data) {
	data.id = parseInt(data.id);
	return ac
		.can(requester.role)
		.context({ requester: requester.ID, owner: data.id })
		.execute('delete')
		.on('user');
}
