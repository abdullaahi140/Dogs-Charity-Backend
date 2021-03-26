exports.up = function (knex) {
	return knex.schema.createTable('refresh', function (table) {
		table.integer('userID').unique().unsigned(),
		table.string('refresh_token', 300),
		table.foreign('userID').references('users.ID').onDelete('CASCADE')
	});
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('refresh');
}
