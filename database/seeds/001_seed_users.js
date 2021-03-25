const hashPassword = require('../../helpers/hashPassword.js');

exports.seed = async function (knex) {
	const admin = await hashPassword({
		username: 'admin',
		password: 'admin',
		firstName: 'Admin',
		lastName: 'User',
		imgURL: 'https://visualpharm.com/assets/314/Admin-595b40b65ba036ed117d36fe.svg'
	})

	const staff = await hashPassword({
		username: 'staff',
		password: 'password',
		firstName: 'Staff',
		lastName: 'User',
		imgURL: 'https://icon-library.com/images/staff-icon/staff-icon-5.jpg'
	})

	const example = await hashPassword({
		username: 'user',
		password: 'password',
		firstName: 'Example',
		lastName: 'User',
		imgURL: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
	})
	
	// Deletes ALL existing entries
	return knex('users').del()
		.then(function () {
			// Inserts seed entries
			return knex('users').insert([admin, staff, example]);
		});
};