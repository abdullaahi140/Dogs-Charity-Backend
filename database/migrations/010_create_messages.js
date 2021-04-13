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
	return knex.schema.createTable('messages', (table) => {
		table.increments('ID').unique();
		table.integer('chatID').unsigned();
		table.integer('senderID').unsigned();
		table.string('message', 1000); // VARCHAR length 1000
		table.timestamp('dateCreated').defaultTo(knex.fn.now());
		table.timestamp('dateModified').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		table.foreign('chatID').references('chats.ID').onDelete('CASCADE');
		table.foreign('senderID').references('users.ID').onDelete('CASCADE');
	});
};

/**
 * Deletes messages table from the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the deleted table
 */
exports.down = function down(knex) {
	return knex.schema.dropTableIfExists('messages');
};
