/**
 * A module to create and delete the locations table from the database
 * @module migrations/005_create_locations
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates locations table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('locations', (table) => {
		table.increments('ID').unique();
		table.string('name').notNullable();
		table.string('staffCode').notNullable();
		table.timestamp('dateCreated').defaultTo(knex.fn.now());
	});
};

/**
 * Deletes locations table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('locations');
};
