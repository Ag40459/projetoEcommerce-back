require('dotenv').config();
// const knex = require("knex")({
//   client: "pg",
//   version: "^8.7.1",
//   connection: {
//     host: process.env.DB_HOST,
//     port: 5432,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     // ssl: {
//     //   rejectUnauthorized: false,
//     // },
//   },
// });

// module.exports = knex;


const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = knex;
