const jwt = require("jsonwebtoken");
const knex = require("../../database/conection");
const secret = require("../config");

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization === "Bearer") {
    return res.status(400).json({ message: "Token não informado." });
  }

  try {
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, secret);

    if (!id) {
      return res.status(400).json({ mensagem: "Token inválido." });
    }

    const userExist = await knex("users").where({ id }).first();

    if (!userExist) {
      return res.status(404).json({ message: ["Usuário não encontrado"] });
    }

    const { id: userId } = userExist;
    req.user = { id: userId };

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = checkToken;