const knex = require("../../database/connection");

const verifyEmail = async (req, res) => {
  const { email } = req.params;

  if (email) {
    const emailCheck = await knex("users").where({ email }).first();

    if (emailCheck) {
      return res.status(400).json({ user: { email: "E-mail já cadastrado" } });
    } else {
      return res.status(200).json({ success: "E-mail disponível" });
    }
  } else {
    return res.status(404).json({ user: { email: "E-mail não informado" } });
  }
};

module.exports = verifyEmail;