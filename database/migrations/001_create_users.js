exports.up = function (knex) {
	return knex.schema.createTable('users', function (table) {
		table.increments('ID').unique(),
		table.string('username').notNullable(),
		table.string('password').notNullable(),
		table.string('passwordSalt').notNullable(),
		table.string('imgURL'),
		table.string('firstName'),
		table.string('lastName'),
		table.string('provider').defaultTo('internal')
		table.timestamp('dateRegistered').defaultTo(knex.fn.now()),
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
		table.unique(['username', 'provider'])
	});
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('users');
}
