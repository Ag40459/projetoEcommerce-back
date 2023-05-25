require('dotenv').config();
const { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const knex = require("../database/conection");

const endpoint = process.env.ENDPOINT_S3;

const s3 = new S3Client({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID_AWS,
        secretAccessKey: process.env.APP_KEY_AWS,
    },
});

const sendImage = async (req, res) => {
    const id = req.user.id;

    const user = await knex('users').select('*').where({ id }).first();

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        const { originalname, buffer, minmetype } = req.file;

        const params = {
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: `imagePlanFree/${user.email}/${originalname}`,
            Body: buffer,
            ContentType: minmetype
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        return res.status(200).json({ message: 'Arquivo enviado com sucesso.' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao enviar arquivo.' });
    }
};

const sendMultImage = async (req, res) => {
    const files = req.files;
    const id = req.user.id;

    const user = await knex('users').select('*').where({ id }).first();

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    try {
        const result = [];

        for (const file of files) {
            if (!file) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
            }

            const { originalname, buffer, minmetype } = file;

            const params = {
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: `${user.plan}/${user.email}/${originalname}`,
                Body: buffer,
                ContentType: minmetype
            };
            console.log(params.Key);

            const command = new PutObjectCommand(params);
            await s3.send(command);

            const bucketUrl = `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3.replace('https://', '')}`;
            const objectUrl = `${bucketUrl}/${user.email}/${encodeURIComponent(originalname)}`;

            result.push({
                url: objectUrl,
                path: originalname
            });
        }

        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const getAllImage = async (req, res) => {
    try {
        const command = new ListObjectsCommand({ Bucket: process.env.BACKBLAZE_BUCKET });
        const response = await s3.send(command);
        const result = []

        for (const file of response.Contents) {
            const bucketUrl = `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3.replace('https://', '')}`;

            const objectUrl = `${bucketUrl}/${file.Key}`;

            const filePath = file.Key.substring(file.Key.indexOf(`${process.env.BACKBLAZE_BUCKET}/`) + 0);

            result.push({
                url: objectUrl,
                path: filePath
            });
        }

        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao obter imagens.' });
    }
};

const imageDelete = async (req, res) => {
    const { file } = req.query;
    if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo fornecido.' });
    }

    try {
        const params = {
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: file,
        };

        try {
            await s3.send(new HeadObjectCommand(params));
        } catch (error) {
            return res.status(404).json({ message: 'Erro, imagem não encontrada.' });

        }

        const command = new DeleteObjectCommand(params);
        await s3.send(command);

        const imageName = file.split('%2F').pop();
        return res.status(200).json({ message: `A imagem ${imageName} foi excluída com sucesso.` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno.' });
    }
};

module.exports = {
    sendImage,
    sendMultImage,
    getAllImage,
    imageDelete
};
