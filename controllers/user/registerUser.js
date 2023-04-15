const knex = require("../../database/conection");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { name, birthdate, phone, email, category, password, confirm_password, address, plan } = req.body.user;

    // Verifica se o email já foi cadastrado
    const userExists = await knex("users").select("*").where({ email: email }).first();
    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // Verifica se a senha e a confirmação de senha são iguais
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Senha e confirmação de senha não conferem." });
    }

    // Criptografa a senha
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      birthdate,
      phone,
      email,
      category,
      password: encryptedPassword,
      address,
      credits: 0,
      plan,
      created_at: Date.now()
    };

    await knex("users").insert(newUser);

    return res.status(200).json({ success: "Novo usuário cadastrado com sucesso." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = registerUser;