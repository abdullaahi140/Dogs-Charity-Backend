/**
 * A module to create and delete the roles table from the database
 * @module migrations/002_create_roles
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates roles table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('roles', (table) => {
		table.integer('userID').unique().unsigned();
		table.string('role');
		table.foreign('userID').references('users.ID').onDelete('CASCADE');
	});
};

/**
 * Deletes roles table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('roles');
};
