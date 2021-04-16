/**
 * A module to create and delete the dogs table from the database
 * @module migrations/004_create_dogs
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates dogs table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('dogs', (table) => {
		table.increments('ID').unique();
		table.string('name').notNullable();
		table.integer('age');
		table.string('breed');
		table.string('description');
		table.integer('imageID').unsigned();
		table.timestamp('dateAdded').defaultTo(knex.fn.now());
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		table.foreign('imageID').references('images.ID');
	});
};

/**
 * Deletes dogs table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('dogs');
};
