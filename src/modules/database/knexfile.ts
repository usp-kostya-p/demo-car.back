import * as dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

console.log(__dirname);

module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    charset: 'utf8',
  },
  pool: { min: 2, max: 16 },
  migrations: {
    directory: __dirname + '/migrations',
  },
};
