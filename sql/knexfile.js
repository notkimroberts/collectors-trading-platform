const dotenv = require('dotenv')


dotenv.config({ path: '../.env' })

module.exports = {
    client: 'postgresql',
    connection: 'postgres://localhost/ctp',
    // TODO: Uncomment this for deployment.
    // connection: {
    //     host : process.env.DATABASE_HOST,
    //     port: process.env.DATABASE_PORT,
    //     user : process.env.DATABASE_USER,
    //     password : process.env.DATABASE_PASSWORD,
    //     database : process.env.DATABASE_NAME,
    //     ssl: { rejectUnauthorized: false }
    // },
    migrations: { tableName: 'knex_migrations' },
    seeds: { directory: './seeds' },
}