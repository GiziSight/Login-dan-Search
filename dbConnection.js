const mysql = require("mysql2");
require('dotenv').config();

const db_connection = mysql
  // .createConnection({
  //   host: "34.101.39.247", // HOST NAME
  //   user: "root", // USER NAME
  //   database: "user_data", // DATABASE NAME
  //   password: "stunting", // DATABASE PASSWORD
  // })
  .createConnection({
    host: process.env.DB_HOST, // HOST NAME
    user: process.env.DB_USER, // USER NAME
    database: process.env.DB_NAME, // DATABASE NAME
    password: process.env.DB_PASSWORD, // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection;
