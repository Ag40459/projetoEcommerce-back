const knex = require("../../database/conection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../../config");


const getAllUser = async (req, res) => {
  try {
    const accounts = await knex('users').select('*');
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const registerUser = async (req, res) => {
  try {
    const { name, birthdate, phone, email, category, password, credits, image_url, confirm_password, address, plan } = req.body;

    const userExists = await knex("users").select("*").where({ email: email }).first();
    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    if (!name || !birthdate || !phone || !email || !category || !password || !confirm_password || !plan) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Senha e confirmação de senha não conferem." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      birthdate,
      phone,
      email,
      category,
      password: encryptedPassword,
      confirm_password,
      address: address,
      credits: credits,
      plan,
      image_url: image_url,
      created_at: new Date().toISOString()
    };


    await knex("users").insert(newUser);

    return res.status(200).json({ success: "Novo usuário cadastrado com sucesso." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    console.log(id);

    const { name, birthdate, phone, email, category, password, confirm_password, address, plan } = req.body;

    const user = await knex('users').select('*').where({ id }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (!name && !birthdate && !phone && !email && !category && !password && !confirm_password && !address && !plan) {
      return res.status(400).json({ error: 'Nenhum campo enviado para atualização.' });
    }

    const updatedUser = {
      name: name || user.name,
      birthdate: birthdate || user.birthdate,
      phone: phone || user.phone,
      email: email || user.email,
      category: category || user.category,
      password: password ? await bcrypt.hash(password, 10) : user.password,
      confirm_password: confirm_password || user.confirm_password,
      address: address || user.address,
      plan: plan || user.plan,
      updated_at: new Date().toISOString()
    };

    await knex('users').update(updatedUser).where({ id });

    return res.status(200).json({ success: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await knex('users').where({ id }).del();

    return res.status(200).json({ success: 'Usuário excluído com sucesso.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const getUsersBySearch = async ({ query }, res) => {
  const { email, phone, plan } = query;

  try {
    const users = await knex('users')
      .select('*')
      .modify((queryBuilder) => {
        if (email) {
          queryBuilder.where('email', 'ilike', `%${email}%`);
        }
        if (phone) {
          queryBuilder.where('phone', 'ilike', `%${phone}%`);
        }
        if (plan) {
          queryBuilder.where('plan', 'ilike', `%${plan}%`);
        }
      });

    return res.status(200).json({ data: { users } });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body.login;

  try {
    const userExist = await knex("users").where({ email }).first();

    if (!userExist) {
      return res
        .status(404)
        .json({ user: { login: "E-mail e/ou senha inválidos" } });
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);

    if (!checkPassword) {
      return res
        .status(400)
        .json({ user: { login: "E-mail e/ou senha inválidos" } });
    }

    const { password: _, ...userData } = userExist;

    const token = jwt.sign(userData, secret, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login efetuado com sucesso",
      token: token,
      dados_do_usuario: userData,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  getUsersBySearch,
  login
};