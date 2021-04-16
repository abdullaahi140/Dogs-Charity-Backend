/**
 * A module to seed users to the database
 * @module seeds/001_seed_users
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

const hashPassword = require('../../helpers/hashPassword.js');

/**
 * Seeds default users to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	const admin = await hashPassword({
		username: 'admin',
		password: 'admin',
		firstName: 'Admin',
		lastName: 'User',
		imageID: 1
	});

	const staff = await hashPassword({
		username: 'staff',
		password: 'password',
		firstName: 'Staff',
		lastName: 'User',
		imageID: 2
	});

	const user = await hashPassword({
		username: 'user',
		password: 'password',
		firstName: 'Example',
		lastName: 'User',
		imageID: 3
	});

	const staff2 = await hashPassword({
		username: 'anotherStaff',
		password: 'password',
		firstName: 'Staff',
		lastName: 'User',
		imageID: 4
	});

	const user2 = await hashPassword({
		username: 'anotherUser',
		password: 'password',
		firstName: 'User',
		lastName: 'User',
		imageID: 5
	});

	// Deletes ALL existing entries
	return knex('users').del()
		// Inserts seed entries
		.then(() => knex('users').insert([admin, staff, user, staff2, user2]));
};
