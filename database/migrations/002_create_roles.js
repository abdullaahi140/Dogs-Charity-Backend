exports.up = function(knex) {
	return knex.schema.createTable('roles', function(table) {
		table.integer('userID').unsigned(),
		table.string('role'),
		table.foreign('userID').references('ID').on('users')
	});
}

exports.down = function(knex) {
	return knex.schema.dropTable('roles');
}