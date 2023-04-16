const express = require("express");
const login = require("./controllers/login");
const routes = express();
const { registerUser, getAllUser, updateUser, deleteUser, getUsersBySearch } = require('./controllers/users');
const { createCategory, getAllCategories, updateCategory, deleteCategory, deleteAllCategories } = require('./controllers/categories');
// const checkToken = require("./middlewares/checkToken/checkToken");

routes.get('/users/accounts', getAllUser);
routes.get('/users/search', getUsersBySearch);
routes.post('/users/signup', registerUser);
routes.patch('/users/updateUser/:id', updateUser);
routes.delete('/users/delete/:id', deleteUser);
routes.post('/users/sign-in', login);
// routes.use(checkToken);

routes.get('/categories', getAllCategories);
routes.post('/categories', createCategory);
routes.patch('/categories/:id', updateCategory);
routes.delete('/categories/:id', deleteCategory);
routes.delete('/categories', deleteAllCategories);


module.exports = routes;
