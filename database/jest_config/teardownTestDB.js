const { knex } = require('../knex.js');

// close Knex connection to allow Jest to close
module.exports = async () => {
	await knex.destroy();
};
