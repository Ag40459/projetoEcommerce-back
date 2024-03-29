const knex = require("../database/conection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../config");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await knex("users").where({ email }).first();
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "E-mail e/ou senha inválidos" });
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ message: "E-mail e/ou senha inválidos" });
    }

    const { password: userPassword, confirm_password: _, ...userData } = userExist;
    const token = jwt.sign(userData, secret, { expiresIn: "1d" });
    req.user = { id: userData.id };
    return res.status(200).json({
      message: "Login efetuado com sucesso",
      token: token,
      userID: userData.id,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
module.exports = login;