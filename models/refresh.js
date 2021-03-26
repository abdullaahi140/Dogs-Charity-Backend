const knex = require('../database/knex.js');

exports.getById = async function getById(id) {
	return knex.from('refresh').select('*').where({ userID: id });
};

exports.add = async function add(user) {
	return knex.from('refresh').insert(user);
}

exports.delById = async function delById(id) {
	return knex.from('refresh').del().where({ userID: id });
};
