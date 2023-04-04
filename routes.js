const express = require("express");
const routes = express();

const verifyEmail = require('./controllers/user/verifyEmail')
const registerUser = require('./controllers/user/registerUser');
const login = require('./controllers/user/login')



routes.get('/', async (req, res) => {
    return res.status(200).json({
        status: "teste."
    })
})

routes.get("/verifyEmail/:email", verifyEmail); // rota de verificação de email cadastrado.
routes.post('/signup', registerUser)
routes.post("/login", login); // rota de geração de token para autorização

module.exports = routes