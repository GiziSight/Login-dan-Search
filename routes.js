const router = require('express').Router();
const { body } = require('express-validator');
const { register } = require('./controllers/registerController');
const { login } = require('./controllers/loginController');
const { getUser } = require('./controllers/getUserController');
const { search } = require('./controllers/searchController'); // Menambahkan controller pencarian

router.post('/register', [
    // Validasi register
], register);

router.post('/login', [
    // Validasi login
], login);

router.get('/getUser', getUser);

router.get('/api/search', [
    // Middleware untuk melindungi endpoint pencarian (gunakan middleware auth di sini jika diperlukan)
], search);

module.exports = router;
