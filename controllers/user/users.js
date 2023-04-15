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
    const { email, password, confirm_password } = req.body;

    if (!email || !password || !confirm_password) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
    }

    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Senha deve conter pelo menos 6 caracteres, incluindo uma maiúscula e uma minúscula." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Senha e confirmação de senha não conferem." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: encryptedPassword,
      confirm_password,
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
    const id = parseInt(req.params.id);

    const { name, birthdate, phone, email, category, password, confirm_password, address, plan, title, description } = req.body;

    const user = await knex('users').select('*').where({ id }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (!name && !birthdate && !phone && !email && !category && !password && !confirm_password && !address && !plan && !title && !description) {
      return res.status(400).json({ error: 'Nenhum campo enviado para atualização.' });
    }

    if (phone && !phone.match(/^\+\d{2}\s\d{2}\s\d{8,9}$/)) {
      return res.status(400).json({ error: 'O telefone deve estar no formato +DD NN NNNNNNNNN ou +DD NN NNNNNNNNNN.' });
    }

    if (title && title.length < 5) {
      return res.status(400).json({ error: 'O título deve ter pelo menos 5 caracteres.' });
    }

    if (description && description.length < 25) {
      return res.status(400).json({ error: 'A descrição deve ter pelo menos 25 caracteres.' });
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
      title: title || '',
      description: description || '',
      updated_at: new Date().toISOString()
    };

    await knex('users').update(updatedUser).where({ id });

    return res.status(200).json({ success: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {

  const { id } = req.params;

  const userExists = await knex('users').select('*').where('id', id).first();

  if (!userExists) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  try {
    const { balance, deposit_pending, bonus_pending } = await knex('accounts')
      .select(knex.raw('SUM(balance) as balance, SUM(deposit_pending) as deposit_pending, SUM(bonus_pending) as bonus_pending'))
      .where('user_id', id)
      .first();

    if (Number(balance) !== 0 || Number(deposit_pending) > 0 || Number(bonus_pending) > 0) {
      return res.status(400).json({ error: 'Não é possível excluir sua conta.' });
    }

    await knex.transaction(async trx => {
      // await trx('transfer_history').where('from_account_id', knex('accounts').select('id').where('user_id', id)).del();
      // await trx('transfer_history').where('to_account_id', knex('accounts').select('id').where('user_id', id)).del();
      // await trx('withdrawal_history').whereIn('account_id', knex('accounts').select('id').where('user_id', id)).del();
      // await trx('deposit_history').whereIn('account_id', knex('accounts').select('id').where('user_id', id)).del();
      await trx('accounts').where('user_id', id).del();
      await trx('users').where('id', id).del();
    });

    return res.status(200).json({ success: 'Usuário excluído com sucesso.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const getUsersBySearch = async ({ query }, res) => {
  const { search } = query;

  try {
    const users = await knex('users')
      .select('*')
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder.where((qb) => {
            qb.where('email', 'ilike', `%${search}%`)
              .orWhere('phone', 'ilike', `%${search}%`)
              .orWhere('plan', 'ilike', `%${search}%`)
              .orWhere(knex.raw(`concat(title, ' ', description)`), 'ilike', `%${search}%`);
          });
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