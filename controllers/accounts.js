const knex = require("../database/conection");

const getAccount = async (req, res) => {
    try {
        const accounts = await knex('accounts').select('*');
        res.status(200).json({ message: 'Contas encontradas com sucesso', accounts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar contas', error: error.message });
    }
};


const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { balance, deposit_pending, deposit_confirmed, bonus } = req.body;

    try {
        const accountExist = await knex("accounts").where({ id, deleted: false }).first();

        if (!accountExist) {
            return res.status(404).json({ message: "Conta não encontrada" });
        }

        const updatedAccount = {};

        if (balance) updatedAccount.balance = balance;
        if (deposit_pending) updatedAccount.deposit_pending = deposit_pending;
        if (deposit_confirmed) updatedAccount.deposit_confirmed = deposit_confirmed;
        if (bonus) updatedAccount.bonus = bonus;

        await knex("accounts").where({ id }).update(updatedAccount);

        return res.status(200).json({ message: "Conta atualizada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar conta", error: error.message });
    }
};

const getAccountId = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await knex("accounts")
            .where({ id, deleted: false })
            .select([
                "id",
                "user_id",
                "balance",
                "deposit_pending",
                "deposit_confirmed",
                "bonus",
                "last_deposit",
                "last_withdrawal",
                "last_bonus",
                "created_at",
            ])
            .first();

        if (!account) {
            return res.status(404).json({ message: "Conta não encontrada" });
        }

        return res.status(200).json({ message: "Conta encontrada", account });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Erro ao buscar conta", error: error.message });
    }
};


module.exports = {
    getAccount,
    updateAccount,
    getAccountId
};
