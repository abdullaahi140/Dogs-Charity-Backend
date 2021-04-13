/**
 * A module to seed messages to the database
 * @module seeds/010_seed_messages
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default messages to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('messages').del()
		// Inserts seed entries
		.then(() => knex('messages').insert([
			{
				chatID: 1,
				senderID: 3,
				message: 'Hi, I want the labradoodle. Is he available?\nMany thanks,\nExample User'
			},
			{
				chatID: 1,
				senderID: 2,
				message: "Sure he's available, when can you come for pickup?\nMany thanks,\nStaff User"
			},
			{
				chatID: 1,
				senderID: 3,
				message: 'Nice, I can get there tomorrow in the morning'
			},
			{
				chatID: 1,
				senderID: 2,
				message: 'Alright, see you then!'
			}
		]));
};
