exports.up = function(knex) {
	return knex.schema.createTable('users', function(table) {
		table.increments('ID'),
		table.string('username'),
		table.string('password'),
		table.string('imgURL'),
		table.string('firstName'),
		table.string('lastName'),
		table.timestamp('dateRegistered').defaultTo(knex.fn.now())
	});
}

exports.down = function(knex) {
	return knex.schema.dropTable('users');
}