const axios = require('axios');
const { validationResult } = require('express-validator');

async function googleSearch(query, apiKey, cx) {
    const baseUrl = 'https://www.googleapis.com/customsearch/v1';
    const params = {
        q: query,
        key: apiKey,
        cx: cx,
    };

    try {
        const response = await axios.get(baseUrl, { params });
        const items = response.data.items.map(item => ({
            judul: item.title,
            deskripsi: item.snippet,
            link: item.link,
            gambar: item.pagemap.cse_image ? item.pagemap.cse_image[0].src : null,
        }));
        return items;
    } catch (error) {
        throw new Error(`Request failed with status code ${error.response.status}`);
    }
}

exports.search = async (req, res) => {
    const apiKey = 'AIzaSyDmZevqi_lnWUo07fZEmXe-mEpynaE1vd4';
    const cx = 'e4de5e5abaefc49ff';
    const query = req.query.query || 'default';

    try {
        const results = await googleSearch(query, apiKey, cx);
        res.status(200).json({ article: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
