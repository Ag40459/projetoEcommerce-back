require('dotenv').config();

const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// const knex = require("knex")({
//   client: "pg",
//   version: "^8.7.1",
//   connection: {
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: 123,
//     database: "listtavipdb",
//     // ssl: {
//     //   rejectUnauthorized: false,
//     // },
//   },
// });



module.exports = knex;
