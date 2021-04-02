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
		imgURL: 'https://visualpharm.com/assets/314/Admin-595b40b65ba036ed117d36fe.svg'
	});

	const staff = await hashPassword({
		username: 'staff',
		password: 'password',
		firstName: 'Staff',
		lastName: 'User',
		imgURL: 'https://icon-library.com/images/staff-icon/staff-icon-5.jpg'
	});

	const example = await hashPassword({
		username: 'user',
		password: 'password',
		firstName: 'Example',
		lastName: 'User',
		imgURL: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
	});

	// Deletes ALL existing entries
	return knex('users').del()
		// Inserts seed entries
		.then(() => knex('users').insert([admin, staff, example]));
};
