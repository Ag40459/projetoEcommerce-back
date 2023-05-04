const jwt = require("jsonwebtoken");
const secret = require("../../config");

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token inválido ou não fornecido." });
    }
    const token = authorization.split(" ")[1];

    try {
        const decoded = await jwt.verify(token, secret);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authMiddleware;