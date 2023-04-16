require('dotenv').config();

secret = process.env.JWT_SECRET;

module.exports = secret;
