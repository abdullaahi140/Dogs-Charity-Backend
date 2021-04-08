/**
 * A module to seed dog favourites to the database
 * @module seeds/008_seed_dog_favourites
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default dog favourites to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('dog_favourites').del()
		// Inserts seed entries
		.then(() => knex('dog_favourites').insert([
			{ userID: 2, dogID: 2 },
			{ userID: 3, dogID: 1 },
			{ userID: 3, dogID: 2 },
			{ userID: 3, dogID: 3 }
		]));
};
