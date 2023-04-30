const knex = require("../database/conection");
const bcrypt = require("bcrypt");

const getAllUser = async (req, res) => {
  try {
    const users = await knex('users').select('*');
    res.status(200).json({ message: 'Conta encontradas com sucesso', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar contas', error: error.message });
  }
};

const getAllUserIdCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await knex('users').select('*').where({ category_id: id });

    const filteredUsers = users.map(({ password, confirm_password, ...rest }) => rest);

    res.status(200).json({ message: 'Usuários encontrados com sucesso', users: filteredUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
};


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
              .orWhere('name', 'ilike', `%${search}%`)
              // .orWhere(knex.raw(`birthdate::text ilike '%${search}%'`))
              .orWhere('category', 'ilike', `%${search}%`)
              .orWhere('address', 'ilike', `%${search}%`)
              // .orWhere('credits', 'ilike', `%${search}%`)
              .orWhere(knex.raw(`concat(title, ' ', description)`), 'ilike', `%${search}%`);
          });
        }
      });

    return res.status(200).json({ data: { users } });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getUsersUnifiedTabled = async (req, res) => {
  try {
    const { id } = req.params;

    const userOrigi = await knex.select().from('users').where('id', id).first();
    if (!userOrigi) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const { password: userPassword, confirm_password: _, ...user } = userOrigi;

    const account = await knex.select().from('accounts').where('user_id', id).first();
    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada para o usuário informado' });
    }

    res.json({ user, account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, birthdate, phone, email, password, confirm_password, state, city, zip_code, category, category_id, credits, plan, image_url, title, description } = req.body;

    if (!email || !password || !confirm_password) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
    }

    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Senha deve conter pelo menos 6 caracteres, incluindo uma maiúscula e uma minúscula." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Senha e confirmação de senha não conferem." });
    }

    if (phone === " " || phone === "") {
    }
    else if (phone && !phone.match(/^\+\d{2}\s\d{2}\s\d{8,9}$/)) {
      return res.status(400).json({ error: 'O telefone deve estar no formato +DD NN NNNNNNNNN ou +DD NN NNNNNNNNNN.' });
    }

    const user = await knex("users").where({ email }).first();
    if (user) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      birthdate,
      phone,
      email,
      category,
      category_id,
      password: encryptedPassword,
      confirm_password: encryptedPassword,
      state,
      city,
      zip_code,
      credits,
      updated_at: new Date().toISOString(),
      plan,
      image_url,
      created_at: new Date().toISOString(),
      title,
      description
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

    const { name, birthdate, phone, email, category_id, password, confirm_password, city, state, plan, zip_code, title, description } = req.body;

    const user = await knex('users').select('*').where({ id }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const userMail = await knex("users").where({ email }).first();
    if (userMail) {
      if (!userMail.email === email) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }
    }

    if (!name && !birthdate && !phone && !email && !category && !password && !confirm_password && !city && !state && !zip_code && !plan && !title && !description) {
      return res.status(400).json({ error: 'Nenhum campo enviado para atualização.' });
    }

    if (phone === " " || phone === "") {
    }
    else if (phone && !phone.match(/^\+\d{2}\s\d{2}\s\d{8,9}$/)) {
      return res.status(400).json({ error: 'O telefone deve estar no formato +DD NN NNNNNNNNN ou +DD NN NNNNNNNNNN.' });
    }

    if (title && title.length < 5) {
      return res.status(400).json({ error: 'O título deve ter pelo menos 5 caracteres.' });
    }

    if (description && description.length < 25) {
      return res.status(400).json({ error: 'A descrição deve ter pelo menos 25 caracteres.' });
    }
    let category = await knex('categories').select('title').where({ id: category_id }).first();
    const updatedUser = {
      name: name || user.name,
      birthdate: birthdate || user.birthdate,
      phone: phone !== undefined ? phone : user.phone !== '' ? user.phone : '',
      email: email || user.email,
      category: category ? category.title : user.category,
      category_id: category_id || user.category_id,
      password: password ? await bcrypt.hash(password, 10) : user.password,
      confirm_password: confirm_password || user.confirm_password,
      city: city || user.city,
      state: state || user.state,
      zip_code: zip_code || user.zip_code,
      plan: plan || user.plan,
      title: title || user.title,
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
};

const deleteAllAccounts = async (req, res) => {

  const { confirmation } = req.body;

  if (confirmation !== 'confirmado') {
    return res.status(400).json({ message: "Confirmação inválida" });
  }

  try {
    const users = await knex('users').select('*');

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Não há usuários para serem excluídos.' });
    }

    await knex.transaction(async trx => {
      for (let user of users) {
        const { balance, deposit_pending, bonus_pending } = await trx('accounts')
          .select(knex.raw('SUM(balance) as balance, SUM(deposit_pending) as deposit_pending, SUM(bonus_pending) as bonus_pending'))
          .where('user_id', user.id)
          .first();

        if (Number(balance) !== 0 || Number(deposit_pending) > 0 || Number(bonus_pending) > 0) {
          return res.status(400).json({ error: 'Não é possível excluir a conta do usuário ' + user.name });
        }

        // await trx('transfer_history').where('from_account_id', knex('accounts').select('id').where('user_id', user.id)).del();
        // await trx('transfer_history').where('to_account_id', knex('accounts').select('id').where('user_id', user.id)).del();
        // await trx('withdrawal_history').whereIn('account_id', knex('accounts').select('id').where('user_id', user.id)).del();
        // await trx('deposit_history').whereIn('account_id', knex('accounts').select('id').where('user_id', user.id)).del();
        await trx('accounts').where('user_id', user.id).del();
        await trx('users').where('id', user.id).del();
      }
    });

    return res.status(200).json({ success: 'Todas as contas de usuários foram excluídas com sucesso.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  getUsersBySearch,
  deleteAllAccounts,
  getUsersUnifiedTabled,
  getAllUserIdCategory
};