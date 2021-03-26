exports.up = function (knex) {
	return knex.schema.createTable('users', function (table) {
		table.increments('ID').unique(),
		table.string('username').unique().notNullable(),
		table.string('password').notNullable(),
		table.string('passwordSalt').notNullable(),
		table.string('imgURL'),
		table.string('firstName'),
		table.string('lastName'),
		table.timestamp('dateRegistered').defaultTo(knex.fn.now()),
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
	});
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('users');
}
