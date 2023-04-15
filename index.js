require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const port = process.env.PORTLISTEN || 3001


app.use(cors());

app.use(express.json());

app.use(routes);

module.exports = app;

app.listen(port);