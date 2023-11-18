const Multer = require('multer');
const imgUpload = require('..modules/imgUpload'); 

/**
 * TODO :
 * POST METHOD KE endpoint yang udah ditentukan dibawah  
 * 
 */
const endpoint = `https://image-detection-soewhs74mq-et.a.run.app/predict_image`;

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
    (req, res, next) => {
        const data = req.body
        if (req.file && req.file.cloudStoragePublicUrl) {
            data.imageUrl = req.file.cloudStoragePublicUrl
        }

        const predictionEndpoint = `https://image-detection-soewhs74mq-et.a.run.app/predict_image`;
        const predictImageUrl = `${predictionEndpoint}?url=${encodeURIComponent(data.imageUrl)}`;
        try {
            const response = await axios.post(predictImageUrl);
            res.send(data);
            res.json({imageUrl: data.imageUrl, prediction: response.data.result});
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.status(200).json({
            message: 'File uploaded successfully.',
            fileUrl: req.file.cloudStoragePublicUrl
        });
    }
];

