require('dotenv').config();
const express = require("express");
const login = require("./controllers/login");
const router = express();
const { registerUser, getAllUser, updateUser, deleteUser, getUsersBySearch, deleteAllAccounts, getUsersUnifiedTabled, getAllUserIdCategory } = require('./controllers/users');
const { createCategory, getAllCategories, updateCategory, deleteCategory, deleteAllCategories } = require('./controllers/categories');
const { updateAccount, getAccount, getAccountId } = require("./controllers/accounts");
const { createImage, getImageById, updateImage, deleteImage, getAllImages } = require("./controllers/images");

const authMiddleware = require("./middlewares/checkToken/checkToken");
const multer = require("./middlewares/multer/multer");

const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");

const endpoint = process.env.ENDPOINT_S3;

const s3 = new S3Client({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID_AWS,
        secretAccessKey: process.env.APP_KEY_AWS,
    },
});

router.post("/upload", multer.single('file'), async (req, res) => {
    res.json(req.file);
});

router.get("/files", async (req, res) => {
    try {
        const command = new ListObjectsCommand({ Bucket: process.env.BACKBLAZE_BUCKET });
        const response = await s3.send(command);
        res.json(response.Contents);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro' });
    }
});

router.get('/users/accounts', getAllUser);
router.get('/users/search', getUsersBySearch);
router.post('/users/sign-up', registerUser);
router.delete('/users/delete/:id', deleteUser);
router.post('/users/sign-in', login);
router.get('/users/unified-tabled/:id', getUsersUnifiedTabled);

router.get('/categories', getAllCategories);
router.get('/users/category/:id', getAllUserIdCategory);

router.use(authMiddleware);

router.patch('/users/updateUser/:id', updateUser);
router.delete('/users', deleteAllAccounts);

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
