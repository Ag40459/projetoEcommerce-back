const express = require("express");
const login = require("./controllers/user/login");
const routes = express();
const { registerUser, getAllUser, updateUser, deleteUser, getUsersBySearch } = require('./controllers/user/users');
const checkToken = require("./middlewares/checkToken/checkToken");

routes.get('/users/accounts', getAllUser);
routes.get('/users/search', getUsersBySearch);
routes.post('/users/signup', registerUser)
routes.put('/users/updateUser/:id', updateUser);
routes.delete('/users/delete/:id', deleteUser);
routes.post('/login', login);
routes.use(checkToken);



module.exports = routes