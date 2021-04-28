/**
 * A module to seed users to the database
 * @module seeds/000_seed_images
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default images to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('images').del()
		// Inserts seed entries
		.then(() => knex('images').insert([
			{ filename: 'avatar1.png', type: 'image/png' },
			{ filename: 'avatar2.png', type: 'image/png' },
			{ filename: 'avatar3.jpg', type: 'image/jpeg' },
			{ filename: 'avatar2.png', type: 'image/png' },
			{ filename: 'avatar3.jpg', type: 'image/jpeg' },
			{ filename: 'dog1.jpg', type: 'image/jpeg' },
			{ filename: 'dog2.jpg', type: 'image/jpeg' },
			{ filename: 'dog3.jpg', type: 'image/jpeg' },
			{ filename: 'dog4.jpg', type: 'image/jpeg' },
			{ filename: 'dog5.jpg', type: 'image/jpeg' }
		]));
};
