require('dotenv').config();
const Multer = require('multer');
const imgUpload = require('../modules/imgUpload'); 
const { default: axios } = require('axios');
const { response } = require('express');

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

/**
 * Express will execute each middleware function in the order they appear in the array. 
 * This allows you to compose and organize your middleware in a clear and sequential manner.
*/
exports.uploadImage = [
    multer.single('image'),
    imgUpload.uploadToCloudStorage,
    (req, res) => {
        const data = req.body
        if (req.file && req.file.cloudStoragePublicUrl) {
            data.imageUrl = req.file.cloudStoragePublicUrl
        }
        const imageUrl = req.file.cloudStoragePublicUrl;
        const predictionEndpoint = process.env.UPLOAD_IMAGE;
        const predictImageUrl = `${predictionEndpoint}?url=${encodeURIComponent(imageUrl)}`;

        axios.post(predictImageUrl)
        .then(response => {
            res.status(200).json({
                message: 'File uploaded successfully.', 
                imageUrl: req.file.cloudStoragePublicUrl, 
                prediction: response.data.result,
                accuracy: response.data.akurasi
                //gizi
                //manfaat
            });
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        })
    }
];

