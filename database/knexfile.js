/**
 * A module to configuration for Knex to connect to a MySQL database
 * @module database/knexfile
 * @author Abdullaahi Farah
 * @see database/migrations/* for database migration files
 * @see database/seeds/* for database seeds files
 */

require('dotenv').config({ path: `${__dirname}/../.env` });

module.exports = {
	development: {
		client: 'mysql2',
		connection: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE
		},
		migrations: {
			directory: `${__dirname}/migrations`
		},
		seeds: {
			directory: `${__dirname}/seeds`
		}
	},
	test: {
		client: 'mysql2',
		connection: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.TEST_DB_DATABASE
		},
		migrations: {
			directory: `${__dirname}/migrations`
		},
		seeds: {
			directory: `${__dirname}/seeds`
		}
	},
	production: {
		client: 'mysql2',
		connection: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE
		},
		migrations: {
			directory: `${__dirname}/migrations`
		},
		seeds: {
			directory: `${__dirname}/seeds`
		}
	}
};
