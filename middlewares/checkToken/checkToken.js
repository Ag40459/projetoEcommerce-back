const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth");

// const checkToken = async (req, res, next) => {
//     const { authorization } = req.headers;

//     if (!authorization || typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Token inválido ou não fornecido." });
//     }
//     const token = authorization.split(" ")[1];

//     try {

//         const { id } = await jwt.verify(token, secret);

//         if (!id) {
//             return res.status(401).json({ message: "Token inválido." });
//         }

//         const user = await knex("users").where({ id }).first();

//         if (!user) {
//             return res.status(404).json({ message: "Usuário não encontrado." });
//         }

//         req.user = { id: user.id };

//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Falha na autenticação. Token inválido." });
//     }
// };

// module.exports = checkToken;


const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = { id: decoded.id }; // define req.user com o id do usuário
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authMiddleware;


module.exports = authMiddleware;
