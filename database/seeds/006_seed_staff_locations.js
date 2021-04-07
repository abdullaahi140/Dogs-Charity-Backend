/**
 * A module to seed staff locations to the database
 * @module seeds/006_seed_locations
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default staff locations to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('staff_locations').del()
		// Inserts seed entries
		.then(() => knex('staff_locations').insert([
			{ staffID: 1, locationID: 1 },
			{ staffID: 2, locationID: 2 },
			{ staffID: 4, locationID: 3 }
		]));
};
