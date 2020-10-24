const dotenv = require('dotenv')

dotenv.config({ path: '../.env' })

module.exports = {
    client: 'postgresql',
    connection: {
        host : 'ec2-54-152-40-168.compute-1.amazonaws.com',
        port: 5432,
        user : 'mscrtihrgsvnnl',
        password : 'a1dc14cac8176940787aaf245f861d8ba3ead3626d1e11c9879934d0a8171011',
        database : 'dddoluj8l08v7d',
        ssl: { rejectUnauthorized: false }
    },
    migrations: { tableName: 'knex_migrations' },
    seeds: { directory: './seeds' },
}


