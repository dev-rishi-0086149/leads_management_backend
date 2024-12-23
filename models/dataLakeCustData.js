const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");

const DatalakeCustData = dbconnect.define(
  "datalake_cust_database",
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      PAN: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      LO_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      loan1_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loan1_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loan2_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loan2_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loan3_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loan3_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      lead_generated:{
        type:Sequelize.INTEGER,
        allowNull:false
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
    tableName: "datalake_cust_database",
    timestamps: true, 
  }
);

module.exports = DatalakeCustData;
