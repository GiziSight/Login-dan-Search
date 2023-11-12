const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "34.101.39.247", // HOST NAME
    user: "root", // USER NAME
    database: "user_data", // DATABASE NAME
    password: "stunting", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection;
