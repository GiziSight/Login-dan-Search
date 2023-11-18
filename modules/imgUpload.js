const { Storage } = require('@google-cloud/storage');
const moment = require('moment');

const gcs = new Storage({
    projectId: 'login-test-bc32d',
    credentials: require('./upload-serviceaccount.json')
});

const bucketName = "image-model-stunting";
const bucket = gcs.bucket(bucketName);
const filePath = "saved-image";

const getStorageEndpoint = (fileName) => `https://storage.googleapis.com/${bucketName}/${filePath}/${fileName}`;

const ImgUpload = {};

ImgUpload.uploadToCloudStorage = (req, res, next) => {
    if (!req.file) return next();

    const originalFileName = req.file.originalname; // Nama file asli yang diunggah
    const timestamp = moment().format("YYYYMMDDHHmmss"); // Format tanggal yang diinginkan, misal YYYYMMDDHHmmss
    const fileExtension = originalFileName.split('.').pop(); // Ekstensi file yang diunggah
    const newFileName = `${timestamp}.${fileExtension}`; // Gabungkan timestamp dengan ekstensi file

    const file = bucket.file(`${filePath}/${newFileName}`);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on("error", (error) => {
        req.file.cloudStorageError = error;
        next(error);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = newFileName;
        req.file.cloudStoragePublicUrl = getStorageEndpoint(newFileName);
        const response = {
            message: 'File uploaded successfully.',
            fileUrl: req.file.cloudStoragePublicUrl
        };

        res.setHeader('Content-Type', 'application/json'); 
        res.status(200).json(response);
        next();
    });

    stream.end(req.file.buffer);
};

module.exports = ImgUpload;
