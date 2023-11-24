const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const conn = require('../dbConnection').promise();

exports.register = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const [row] = await conn.execute(
            'SELECT `email` FROM `users` WHERE `email`=?',
            [req.body.email]
        );

        if (row.length > 0) {
            return res.status(201).json({
                message: 'The E-mail already in use',
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await conn.execute(
            'INSERT INTO `users`(`username`,`email`,`password`,`gender`,`birthdate`,`height`,`weight`) VALUES(?,?,?,?,?,?,?)',
            [
                req.body.username,
                req.body.email,
                hashPass,
                req.body.gender,
                req.body.birthdate,
                req.body.height,
                req.body.weight,
            ]
        );

        if (rows.affectedRows === 1) {
            // Generate JWT token after successful registration
            const token = jwt.sign({ email: req.body.email }, 'your-secret-key', { expiresIn: '1h' });
            return res.status(201).json({ message: 'The user has been successfully registered.', token });
        }
    } catch (err) {
        next(err);
    }
};
