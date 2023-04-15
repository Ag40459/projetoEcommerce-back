const knex = require("../../database/conection");
const bcrypt = require("bcrypt");


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
    const {
      name,
      birthdate,
      phone,
      email,
      category,
      password,
      credits,
      image_url,
      confirm_password,
      address,
      plan,
      title,
      description
    } = req.body;

    const userExists = await knex("users")
      .select("*")
      .where({ email: email })
      .first();

    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    if (
      !name ||
      !birthdate ||
      !phone ||
      !email ||
      !category ||
      !password ||
      !confirm_password ||
      !plan ||
      !title ||
      !description
    ) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios não preenchidos." });
    }

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ error: "Senha e confirmação de senha não conferem." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      birthdate,
      phone,
      email,
      category,
      password: encryptedPassword,
      address,
      credits,
      plan,
      title,
      description,
      image_url,
      created_at: new Date().toISOString()
    };

    await knex.transaction(async (trx) => {
      const insertedUsersIds = await trx("users").insert(newUser).returning("id");
      const accountId = insertedUsersIds[0];

      const newAccount = {
        user_id: accountId.id,
        balance: 0,
        created_at: new Date().toISOString(),
      };

      await trx("accounts").insert(newAccount);

      const createdUser = await trx("users")
        .select("*")
        .where({ id: accountId.id })
        .first();

      delete createdUser.password;
      delete createdUser.confirm_password;

      const createdAccount = await trx("accounts")
        .select("*")
        .where({ user_id: accountId.id })
        .first();

      return res.status(200).json({ success: "Novo usuário cadastrado com sucesso.", user: createdUser, account: createdAccount });
    });
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

module.exports = {
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  getUsersBySearch
};