/**
 * A module to create and delete the images table from the database
 * @module migrations/011_create_images
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates images table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('images', (table) => {
		table.increments('ID').unique();
		table.string('filename', 41);
		table.string('type');
		table.timestamp('dateCreated').defaultTo(knex.fn.now());
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
};

/**
 * Deletes images table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('images');
};
