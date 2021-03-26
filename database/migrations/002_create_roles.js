exports.up = function (knex) {
	return knex.schema.createTable('roles', function (table) {
		table.integer('userID').unique().unsigned(),
		table.string('role'),
		table.foreign('userID').references('users.ID').onDelete('CASCADE')
	});
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('roles');
}
