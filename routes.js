const express = require("express");
const routes = express();

const { registerUser, getAllUser, updateUser, deleteUser, getUsersBySearch } = require('./controllers/user/Users');

routes.get('/users/accounts', getAllUser);
routes.post('/users/signup', registerUser)
routes.put('/users/updateUser/:id', updateUser);
routes.delete('/users/delete/:id', deleteUser);
routes.get('/users/search', getUsersBySearch);
module.exports = routes
