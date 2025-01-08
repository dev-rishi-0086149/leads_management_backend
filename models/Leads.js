const Sequelize = require("sequelize");
const dbconnect = require("../util/sequelize_mysql_config");

const Leads = dbconnect.define(
  "leads",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cust_database_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // 0 - website
    // 1 - datalake
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    //0-pending
    //1-contacted/waiting for callback
    //2-contacted/intrested
    //3-contacted/cold lead
    status: {
      type: Sequelize.INTEGER,
    },
    contacted_on: {
      type: Sequelize.DATE,
    },

    lead_origin_date: {
      type: Sequelize.DATE,
    },
    LO_id: {
      type: Sequelize.INTEGER,
    },
    amount_interested: {
      type: Sequelize.INTEGER,
    },
    ////
    annual_income:{
      type:Sequelize.STRING,
    },
    address:{
      type:Sequelize.STRING,
    },
    


  },
  {
    tableName: "leads",
    timestamps: true,
  }
);

module.exports = Leads;



// const saveFiles = async (files, policy_id, version, type) => {
//   try {
//     if (type == 3) {
//       const fileLogStatus = await FileLog.create({
//         policy_id,
//         file_name: files[0],
//         version,
//         type,
//       });
//       if (!fileLogStatus) {
//         throw { status: false, message: "error while logging to tbl_files" };
//       }
//     } else {
//       const folder = "public/policy_document";
//       fs.mkdirSync(folder, { recursive: true });
//       files.map(async (file, index) => {
//         let extension = path.extname(file.originalname);
//         let displayName = getDisplayPolicyId(policy_id);
//         const timeStamp = Math.floor(Date.now() / 1000);
//         let fileName = `${displayName}-v${version}-${timeStamp}${index}${extension}`;
//         fs.writeFile(`${folder}/${fileName}`, file.buffer, (err) => {
//           if (err) {
//             throw { status: false, message: "error while saving files" };
//           }
//         });
//         //log the file to tbl_files
//         const fileLogStatus = await FileLog.create({
//           policy_id,
//           file_name: fileName,
//           version,
//           type,
//         });
//         if (!fileLogStatus) {
//           throw { status: false, message: "error while logging to tbl_files" };
//         }
//       });
//     }
//     return { status: true, message: "files saved successfully" };
//   } catch (error) {
//     console.log(error);
//     return { status: false, message: error.message };
//   }
// };