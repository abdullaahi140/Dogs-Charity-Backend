/**
 * A module to seed chats to the database
 * @module seeds/010_seed_chats
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default chats to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('chats').del()
		// Inserts seed entries
		.then(() => knex('chats').insert([
			{ userID: 3, locationID: 2 }
		]));
};
