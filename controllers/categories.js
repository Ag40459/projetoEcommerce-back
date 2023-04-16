const knex = require("../database/conection");

const createCategory = async (req, res) => {
    const { title, description, image_url } = req.body;

    if (!title || !description || !image_url) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios" });
    }

    try {
        await knex.transaction(async (trx) => {
            const categoryExist = await trx("categories").where({ title }).first();

            if (categoryExist) {
                return res.status(400).json({ message: "Categoria já cadastrada" });
            }

            const [category] = await trx("categories").insert({ title, description, image_url }).returning(["title", "description", "image_url"]);

            return res.status(201).json({ message: "Categoria criada com sucesso", category });
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar categoria", error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url } = req.body;

    if (!title && !description && !image_url) {
        return res.status(400).json({ message: "Preencha pelo menos um campo para atualização" });
    }

    try {
        const categoryExist = await knex("categories").where({ id }).first();

        if (!categoryExist) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }

        const updatedCategory = {};

        if (title) updatedCategory.title = title;
        if (description) updatedCategory.description = description;
        if (image_url) updatedCategory.image_url = image_url;

        await knex("categories").where({ id }).update(updatedCategory);

        return res.status(200).json({ message: "Categoria atualizada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar categoria", error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const categoryExist = await knex("categories").where({ id }).first();

        if (!categoryExist) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }

        await knex("categories").where({ id }).del();

        return res.status(200).json({ message: "Categoria deletada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar categoria", error: error.message });
    }
};

const deleteAllCategories = async (req, res) => {
    const { confirmation } = req.body;

    if (confirmation !== 'confirmado') {
        return res.status(400).json({ message: "Confirmação inválida" });
    }

    try {
        await knex.raw("DELETE FROM categories");

        return res.status(200).json({ message: "Todas as categorias foram deletadas com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar categorias", error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await knex("categories");

        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar categorias", error: error.message });
    }
};

module.exports = { createCategory, updateCategory, deleteCategory, deleteAllCategories, getAllCategories };