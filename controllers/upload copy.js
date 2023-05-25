const { S3Client, PutObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

const endpoint = process.env.ENDPOINT_S3;

const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://s3.us-west-004.backblazeb2.com',
    credentials: {
        accessKeyId: process.env.KEY_ID_AWS,
        secretAccessKey: process.env.APP_KEY_AWS,
    },
});

const sendImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        const { originalname, buffer, mimetype } = req.file;

        const params = {
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: originalname,
            Body: buffer,
            ContentType: mimetype,
        };

        const command = new PutObjectCommand(params);
        const response = await s3.send(command);

        if (response && response.ETag && response.VersionId) {
            const signedUrl = await getSignedUrl(s3, {
                method: "GET",
                bucket: process.env.BACKBLAZE_BUCKET,
                key: originalname,
            });

            const { Key } = response;
            return res.status(200).json({ Location: signedUrl, Key });
        } else {
            throw new Error('Resposta inválida do Amazon S3.');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao enviar arquivo.' });
    }
};


const getImages = async (req, res) => {
    try {
        const command = new ListObjectsCommand({ Bucket: process.env.BACKBLAZE_BUCKET });
        const response = await s3.send(command);
        res.json(response.Contents);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao obter imagens.' });
    }
};

module.exports = {
    sendImage,
    getImages
};
