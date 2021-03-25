const knex = require('../database/knex.js');

exports.add = async function add(userWithRole) {
	return knex.from('roles').insert(userWithRole);
}
