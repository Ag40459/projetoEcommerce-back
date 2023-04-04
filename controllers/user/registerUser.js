const knex = require("../../database/conection");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  
  try {
    
    const { name, email, password } = req.body.user;
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: encryptedPassword,
      create_at: Date.now()
    };

    await knex("users").insert(newUser);

    return res.status(200).json({ success: "Novo Usuario Cadastrado" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = registerUser;