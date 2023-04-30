const express = require("express");
const login = require("./controllers/login");
const router = express();
const { registerUser, getAllUser, updateUser, deleteUser, getUsersBySearch, deleteAllAccounts, getUsersUnifiedTabled, getAllUserIdCategory } = require('./controllers/users');
const { createCategory, getAllCategories, updateCategory, deleteCategory, deleteAllCategories } = require('./controllers/categories');
const { updateAccount, getAccount, getAccountId } = require("./controllers/accounts");
const { createImage, getImageById, updateImage, deleteImage, getAllImages } = require("./controllers/images");

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
router.get('/users/category/:id', getAllUserIdCategory);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.delete('/categories', deleteAllCategories);

router.get('/accounts', getAccount);
router.patch('/accounts/:id', updateAccount);
router.get('/accounts/:id', getAccountId);

router.post("/images", createImage);
router.get("/images", getAllImages);
router.get("/images/:id", getImageById);
router.put("/images/:id", updateImage);
router.delete("/images/:id", deleteImage);

module.exports = router;
