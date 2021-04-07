/**
 * A module to seed locations to the database
 * @module seeds/005_seed_locations
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default locations to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	// Deletes ALL existing entries
	return knex('locations').del()
		// Inserts seed entries
		.then(() => knex('locations').insert([
			{ name: 'Admin Location', staffCode: 'FMAcM6A4!1Z6et@f' },
			{ name: 'Animal Rescue', staffCode: 'xJZUFO82@ivDBMWX' },
			{ name: 'Dogs Trust', staffCode: 'f!Xos04aH9tLfF30' }
		]));
};
