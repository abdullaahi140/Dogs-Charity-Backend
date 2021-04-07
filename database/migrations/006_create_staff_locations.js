/**
 * A module to create and delete the staff locations table from the database
 * @module migrations/006_create_staff_locations
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates staff locations table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('staff_locations', (table) => {
		table.integer('staffID').unique().unsigned();
		table.integer('locationID').unsigned();
		table.foreign('staffID').references('users.ID').onDelete('CASCADE');
		table.foreign('locationID').references('locations.ID').onDelete('CASCADE');
	});
};

/**
 * Deletes staff locations table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('staff_locations');
};
