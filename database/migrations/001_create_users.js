/**
 * A module to create and delete the users table from the database
 * @module migrations/001_create_users
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates users table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('users', (table) => {
		table.increments('ID').unique();
		table.string('username').notNullable();
		table.string('firstName');
		table.string('lastName');
		table.string('password').notNullable();
		table.string('passwordSalt').notNullable();
		table.string('imgURL');
		table.string('provider').defaultTo('internal');
		table.timestamp('dateRegistered').defaultTo(knex.fn.now());
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		table.unique(['username', 'provider']);
	});
};

/**
 * Deletes users table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('users');
};
