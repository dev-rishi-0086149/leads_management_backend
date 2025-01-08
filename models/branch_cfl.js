const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");

const CflBranch = dbconnect.define(
  "cfl_branch",
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      area: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      branch_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      branch_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      pincode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
  },
  {
    tableName: "cfl_branch",
    timestamps: true, 
  }
);

module.exports = CflBranch;
