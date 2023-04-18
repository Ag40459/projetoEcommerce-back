require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(router);
app.listen(port);

module.exports = app;