/**
 * A module to seed roles to the database
 * @module seeds/002_seed_roles
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default roles to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = function seed(knex) {
	// Deletes ALL existing entries
	return knex('roles').del()
		// Inserts seed entries
		.then(() => knex('roles').insert([
			{ userID: 1, role: 'admin' },
			{ userID: 2, role: 'staff' },
			{ userID: 3, role: 'user' },
			{ userID: 4, role: 'staff' }
		]));
};
