const knex = require('knex');
const knexConfig = require('./sql/knexfile')

module.exports = knex(knexConfig)