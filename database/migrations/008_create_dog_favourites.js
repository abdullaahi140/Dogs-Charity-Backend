/**
 * A module to create and delete the dog locations table from the database
 * @module migrations/008_create_dog_favourites
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates dog favourites table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('dog_favourites', (table) => {
		table.integer('userID').unsigned();
		table.integer('dogID').unsigned();
		table.foreign('userID').references('users.ID').onDelete('CASCADE');
		table.foreign('dogID').references('dogs.ID').onDelete('CASCADE');
		table.unique(['userID', 'dogID']);
	});
};

/**
 * Deletes dog favourites table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('dog_favourites');
};
