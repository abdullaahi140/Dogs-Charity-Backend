const { knex } = require('../knex.js');

// Function to wipe test database and insert data
module.exports = async () => {
	await knex.migrate.rollback();
	await knex.migrate.latest();
	await knex.seed.run();
};
