const knex = require('../database/knex.js');

exports.getAll = async function getAll() {
	return knex.from('users').select('users.*', 'roles.role')
		.leftJoin('roles', 'users.ID', 'roles.userID')
};

exports.getById = async function getById(id, provider = 'internal') {
	return knex.from('users').select('users.*', 'roles.role')
		.where({ ID: id, provider: provider })
		.leftJoin('roles', 'users.ID', 'roles.userID')
};

exports.getByUsername = async function getByUsername(username, provider = 'internal') {
	return knex.from('users').select('users.*', 'roles.role')
		.where({ username: username, provider: provider })
		.leftJoin('roles', 'users.ID', 'roles.userID')
};

exports.getOrAdd = async function getOrAdd(user, provider = 'internal') {
	const result = await module.exports.getByUsername(user.username, provider);
	let data;

	if (result.length) {
		return result;
	} else {
		data = await module.exports.add(user, user.provider);
	}
	
	if (data.length) {
		const id = data[0]
		return await module.exports.getById(id, user.provider);
	}
}

exports.add = async function add(user, provider = 'internal') {
	user.provider = provider;
	return knex.from('users').insert(user);
};

exports.update = async function update(id, user, provider = 'internal') {
	return knex.from('users').update(user).where({ ID: id, provider: provider });
};

exports.delById = async function delById(id, provider = 'internal') {
	return knex.from('users').del().where({ ID: id, provider: provider });
};
