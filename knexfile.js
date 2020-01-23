require('dotenv').config();
const path = require('path');

const {
    PG_HOST,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    NODE_ENV,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

module.exports = {
    client: 'pg',
    connection: {
        host: PG_HOST,
        database: NODE_ENV === 'test' ? POSTGRES_DB_TEST : POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    },
    migrations: {
        directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds'),
    },
};
