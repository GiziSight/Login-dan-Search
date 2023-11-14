const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
      'INSERT INTO `users`(`username`,`email`,`password`,`gender`,`age`,`height`,`weight`) VALUES(?,?,?,?,?,?,?)',
      [
        req.body.username,
        req.body.email,
        hashPass,
        req.body.gender, 
        req.body.age, 
        req.body.height, 
        req.body.weight, 
      ]
    );

    if (rows.affectedRows === 1) {
      const token = jwt.sign({ email: req.body.email }, 'your-secret-key', { expiresIn: '1h' });
      return res.status(201).json({ message: 'The user has been successfully inserted.', token });
    }
  } catch (err) {
    next(err);
  }
};
