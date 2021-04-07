/**
 * A module to create and delete the dog locations table from the database
 * @module migrations/007_create_dog_locations
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates dog locations table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('dog_locations', (table) => {
		table.integer('dogID').unique().unsigned();
		table.integer('locationID').unsigned();
		table.foreign('dogID').references('dogs.ID').onDelete('CASCADE');
		table.foreign('locationID').references('locations.ID').onDelete('CASCADE');
	});
};

/**
 * Deletes dog locations table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('dog_locations');
};
