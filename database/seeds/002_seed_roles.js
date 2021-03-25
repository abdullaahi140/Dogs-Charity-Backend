exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex('roles').truncate()
		.then(function () {
			// Inserts seed entries
			return knex('roles').insert([
				{ userID: 1, role: 'admin' },
				{ userID: 2, role: 'staff' },
				{ userID: 3, role: 'user' }
			]);
		});
};
