const express = require('express');
const routes = require('./routes');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);


app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is running on port ' + PORT));
