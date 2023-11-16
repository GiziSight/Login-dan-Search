const { Storage } = require('@google-cloud/storage');
const moment = require('moment');

const gcs = new Storage({
    projectId: login-test-bc32d,
    credentials: require('../upload-serviceaccount.json')
});

const bucketName = "image-model-stunting";
const bucket = gcs.bucket(bucketName);
const filePath = "image-model-stunting/saved-image";

const getStorageEndpoint = (fileName) => `https://storage.googleapis.com/${filePath}/${fileName}`;

const imgUpload = {};

imgUpload.uploadToCloudStorage = (req, res, next) => {
    if(!req) return next();

    const objectname = moment().format();
    const file = bucket.file(objectname);

    const stream = file.createReadStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on("error", (error) => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = objectname;
        req.file.cloudStoragePublicUrl = getStorageEndpoint(objectname);
        next();
    });

    stream.end(req.file.buffer);
}


module.exports = ImgUpload
