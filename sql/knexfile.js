const dotenv = require('dotenv')

dotenv.config({path: '../.env'})

module.exports = {
    development: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
             directory: './seeds'
        },
    },
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds'
       },
    },
};