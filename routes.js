const express = require("express");
const routes = express();

const verifyEmail = require('./controllers/user/verifyEmail')
const registerUser = require('./controllers/user/registerUser');
const loginUser = require('./controllers/user/login')

routes.get("/users/verifyEmail/:email", verifyEmail);
routes.post('/users/signup', registerUser)
routes.post("/users/login", loginUser);

module.exports = routes
