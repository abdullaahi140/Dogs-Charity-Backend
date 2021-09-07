/**
 * A module to create and delete the refresh table from the database
 * @module migrations/003_create_refresh
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates refresh table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('refresh', (table) => {
		table.integer('userID').unique().unsigned();
		table.string('refresh_token', 300);
		table.timestamp('expiryDate').defaultTo(knex.fn.now());
		table.foreign('userID').references('users.ID').onDelete('CASCADE');
	});
};

/**
 * Deletes refresh table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('refresh');
};
