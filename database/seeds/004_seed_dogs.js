/**
 * A module to seed dogs to the database
 * @module seeds/004_seed_dogs
 * @author Abdullaahi Farah
 * @see migrations/* for database migration files
 * @see seeds/* for other database seeds files
 */

/**
 * Seeds default dogs to the database
 * @param {Object} knex - The Knex object with the configuration file applied to it
 * @returns {Promise} - Promise object representing the seeded table
 */
exports.seed = async function seed(knex) {
	const dog1 = {
		name: 'George',
		age: 5,
		gender: 'Male',
		breed: 'Rottweiler',
		description: 'A beautiful rottweiler',
		imageID: 6
	};

	const dog2 = {
		name: 'Jack',
		age: 1,
		gender: 'Male',
		breed: 'Shiba',
		description: 'A very young shiba',
		imageID: 7
	};

	const dog3 = {
		name: 'Sophie',
		age: 3,
		gender: 'Female',
		breed: 'Poodle',
		description: 'A wild poodle',
		imageID: 8
	};

	const dog4 = {
		name: 'Phoebe',
		age: 7,
		gender: 'Female',
		breed: 'Labradoodle',
		description: 'A small labradoodle',
		imageID: 9
	};

	const dog5 = {
		name: 'Phoebe',
		age: 2,
		gender: 'Female',
		breed: 'Kelpie',
		description: 'A bouncing kelpie',
		imageID: 10
	};

	// Deletes ALL existing entries
	return knex('dogs').del()
		// Inserts seed entries
		.then(() => knex('dogs').insert([dog1, dog2, dog3, dog4, dog5]));
};
