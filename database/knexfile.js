// Update with your config settings.
require('dotenv').config({path: `${__dirname}/../.env`});

module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    migrations: {
        directory: "./migrations"
    },
    seeds: {
        directory: "./seeds"
    }
};
