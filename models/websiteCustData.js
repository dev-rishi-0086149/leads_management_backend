const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");

const WebsiteCustData = dbconnect.define(
  "website_cust_data",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cust_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    aadhar: {
      type: Sequelize.STRING(12), 
      allowNull: false,
      unique: true, 
    },
    PAN: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true, 
    },
    cibil_score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 300, 
        max: 900, 
      },
    },
    phone_no: {
      type: Sequelize.STRING(15),
      allowNull: false,
      unique: true, 
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW, 
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW, 
    },
  },
  {
    tableName: "website_cust_data",
    timestamps: true, 
  }
);

module.exports = WebsiteCustData;
