const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");


const Users = dbconnect.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emp_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emp_email: {
      type: Sequelize.INTEGER,
    },
    branch_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = Users;
