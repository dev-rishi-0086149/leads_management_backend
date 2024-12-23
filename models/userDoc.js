const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");

const UserDocs = dbconnect.define(
  "user_docs",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lead_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    //0-aahar docs
    //1-pan docs
    //2-property docs
    //3-bank statement
    //
    doc_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    file_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user_docs",
    timestamps: true,
  }
);

module.exports = UserDocs;
