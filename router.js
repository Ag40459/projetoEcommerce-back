const express = require("express");
const login = require("./controllers/login");
const router = express();
const { registerUser, getAllUser, updateUser, deleteUser, getUsersBySearch, deleteAllAccounts, getUsersUnifiedTabled } = require('./controllers/users');
const { createCategory, getAllCategories, updateCategory, deleteCategory, deleteAllCategories } = require('./controllers/categories');
const { updateAccount, getAccount, getAccountId } = require("./controllers/accounts");

// const checkToken = require("./middlewares/checkToken/checkToken");

router.get('/users/accounts', getAllUser);
router.get('/users/search', getUsersBySearch);
router.post('/users/sign-up', registerUser);
router.patch('/users/updateUser/:id', updateUser);
router.delete('/users/delete/:id', deleteUser);
router.delete('/users', deleteAllAccounts);
router.get('/users/unified-tabled/:id', getUsersUnifiedTabled);
router.post('/users/sign-in', login);
// router.use(checkToken);

router.get('/categories', getAllCategories);
router.get('/users/categories/:category_id', getAllUserIdCategory);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.delete('/categories', deleteAllCategories);

router.get('/accounts', getAccount);
router.patch('/accounts/:id', updateAccount);
router.get('/accounts/:id', getAccountId);


module.exports = router;