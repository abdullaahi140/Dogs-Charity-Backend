/**
 * A module to seed dog locations to the database
 * @module seeds/007_seed_locations
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default dog locations to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('dog_locations').del()
		// Inserts seed entries
		.then(() => knex('dog_locations').insert([
			{ dogID: 1, locationID: 3 },
			{ dogID: 2, locationID: 2 },
			{ dogID: 3, locationID: 3 },
			{ dogID: 4, locationID: 2 },
			{ dogID: 5, locationID: 3 }
		]));
};
