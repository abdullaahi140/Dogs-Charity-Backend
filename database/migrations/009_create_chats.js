/**
 * A module to create and delete the messages table from the database
 * @module migrations/010_create_messages
 * @author Abdullaahi Farah
 * @see migrations/* for other database migration files
 * @see seeds/* for database seeds files
 */

/**
 * Creates messages table to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the new table
 */
exports.up = function up(knex) {
	return knex.schema.createTable('chats', (table) => {
		table.increments('ID').unique();
		table.integer('userID').unsigned();
		table.integer('locationID').unsigned();
		table.timestamp('dateCreated').defaultTo(knex.fn.now());
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		table.foreign('userID').references('users.ID').onDelete('CASCADE');
		table.foreign('locationID').references('locations.ID').onDelete('CASCADE');
		table.unique(['userID', 'locationID']);
	});
};

/**
 * Deletes messages table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('chats');
};
