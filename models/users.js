const knex = require('../database/knex.js');

exports.getAll = async function getAll() {
	return knex.from('users').select('users.*', 'roles.role')
		.leftJoin('roles', 'users.id', 'roles.userID')
};

exports.getById = async function getById(id) {
	return knex.from('users').select('users.*', 'roles.role').where({ ID: id })
		.leftJoin('roles', 'users.id', 'roles.userID')
};

exports.getByUsername = async function getByUsername(username) {
	return knex.from('users').select('users.*', 'roles.role').where({ username: username })
		.leftJoin('roles', 'users.id', 'roles.userID')
};

exports.add = async function add(user) {
	return knex.from('users').insert(user);
};

exports.update = async function update(id, user) {
	return knex.from('users').update(user).where({ ID: id });
};

exports.delById = async function delById(id) {
	return knex.from('users').del().where({ ID: id });
}
