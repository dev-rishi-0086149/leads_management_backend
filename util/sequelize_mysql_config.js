const Sequelize = require("sequelize");

let dbconnect =null;
try {
   dbconnect = new Sequelize(
    "leads_management",
    "root",
    "1@Lemonorange",
    {
      dialect: "mysql",
      host: "localhost",
      port: 3306,
      logging: false,
    }
  );
} catch (error) {
  console.log("error while connecting to DB ", error);
}

console.log("connection to DB successful");

module.exports = dbconnect;

