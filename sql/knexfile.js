const dotenv = require('dotenv')
const knex = require('knex')

dotenv.config({ path: '../.env' })

module.exports = {
    client: 'postgresql',
    connection: {
        host : process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false }
    },
    migrations: { tableName: 'knex_migrations' },
    seeds: { directory: './seeds' },
}

// knex('collector').insert([{username: dfakjdfkj, password=31413}])
// knex(collector).insert(JSON.parse(req.body.is_admin, req.body.username, req.body.password, req.body.fullname, req.body.address,
//     req.body.city, req.body.state, req.body.country, req.body.contact_email, req.body.phone_number))
