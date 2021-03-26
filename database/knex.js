const { development } = require('./knexfile.js');
const knex = require('knex')(development);

module.exports = knex;
