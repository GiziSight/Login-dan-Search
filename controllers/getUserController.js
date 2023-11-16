const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.getUser = async (req, res, next) => {

    try {
        const user = req.query

        const [row] = await conn.execute(
            "SELECT id,username,email,gender,age,height,weight FROM users WHERE email=?",
            [user.email]
        );
        if (row.length > 0) {
            return res.status(200).json({
                user: row[0]
            });
        }
        res.status(400).json({
            message: "No user found"
        });

    }
    catch (err) {
        next(err);
    }

}
