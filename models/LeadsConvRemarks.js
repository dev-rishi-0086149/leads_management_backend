const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");

const ConvRemarks = dbconnect.define(
  "leads_conv_remarks",
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


    //0->callback requested
    //1->not intrested
    response_type :{
      type:Sequelize.INTEGER
    },
    remarks:{
      type:Sequelize.TEXT,
    },
  },
  {
    tableName: "leads_conv_remarks",
    timestamps: true, 
  }
);

module.exports = ConvRemarks;