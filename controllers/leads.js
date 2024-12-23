const { Sequelize } = require("sequelize");
const { where, Op } = require("sequelize");
const fs = require("fs").promises;
const {
  WebsiteCustData,
  Leads,
  ConvRemarks,
  DatalakeCustData,
  UserDocs,
} = require("../models/association");
const path = require("path");

//testing
// raw website customer data
const getWebsiteRaw = async (req, res) => {
  try {
    const pageno = parseInt(req.query.pageno) || 1;
    const rown = parseInt(req.query.rown) || 10;

    const limit = rown;
    const offset = (pageno - 1) * rown;

    const data = await WebsiteCustData.findAll({
      limit,
      offset,
    });
    return res.status(200).json({ status: true, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting data" });
  }
};
const getRawCountWebsite = async (req, res) => {
  try {
    const data = await WebsiteCustData.count();
    return res.status(200).json({ status: true, count: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting data" });
  }
};

// raw datalake data
const getDataLakeeRaw = async (req, res) => {
  try {
    const pageno = parseInt(req.query.pageno) || 1;
    const rown = parseInt(req.query.rown) || 10;

    const limit = rown;
    const offset = (pageno - 1) * rown;

    const data = await DatalakeCustData.findAll({
      limit,
      offset,
    });
    return res.status(200).json({ status: true, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting data" });
  }
};
const getRawCountDataLake = async (req, res) => {
  try {
    const data = await DatalakeCustData.count();
    return res.status(200).json({ status: true, count: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting data" });
  }
};

//website leads
const getLeads = async (req, res) => {
  try {
    //?tab=0 -active leads
    //1-upcoming leads
    //2-contacted/intrested
    //3-contacted/cold lead
    const tab = parseInt(req.query.tab) || 0;

    //?type = 0 - website
    //1 - datalake
    let type = req.query.type;
    type = !isNaN(type) && !isNaN(parseFloat(type)) ? parseInt(type) : null;

    const pageno = parseInt(req.query.pageno) || 1;
    const rown = parseInt(req.query.rown) || 10;

    const limit = rown;
    const offset = (pageno - 1) * rown;

    let whereCondition = {};
    if (tab == 0) {
      //active leads
      whereCondition = {
        [Op.or]: [
          { status: 0 },
          { status: 1, lead_origin_date: { [Op.lte]: new Date() } },
        ],
      };
    } else if (tab == 1) {
      //upcoming leads
      whereCondition = {
        status: 1,
        lead_origin_date: { [Op.gte]: new Date() },
      };
    } else if (tab == 2) {
      //intrested
      whereCondition = {
        status: 2,
      };
    } else if (tab == 3) {
      whereCondition = {
        status: 3,
      };
    }
    whereCondition.LO_id = req.id;

    if (type == 0 || type == 1) whereCondition.type = type;

    const data = await Leads.findAll({
      where: whereCondition,
      include: [
        {
          model: WebsiteCustData,
          as: "website_cust_data",
          required: false, // Include only if type === 0
          where: Sequelize.literal("leads.type = 0"),
        },
        {
          model: DatalakeCustData,
          as: "datalake_cust_data",
          required: false, // Include only if type === 0
          where: Sequelize.literal("leads.type = 1"),
        },
        {
          model: ConvRemarks,
          as: "conv",
        },
      ],
      order: [["lead_origin_date", "ASC"]],
      limit,
      offset,
    });
    return res.status(200).json({ status: true, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting data" });
  }
};

const getLeadsCount = async (req, res) => {
  try {
    //?tab=0 -active leads
    //1-upcoming leads
    //2-contacted/intrested
    //3-contacted/cold lead
    const tab = parseInt(req.query.tab) || 0;

    //?type = 0 - website
    //1 - datalake
    let type = req.query.type;
    type = !isNaN(type) && !isNaN(parseFloat(type)) ? parseInt(type) : null;

    let whereCondition = {};
    if (tab == 0) {
      //active leads
      whereCondition = {
        [Op.or]: [
          { status: 0 },
          { status: 1, lead_origin_date: { [Op.lte]: new Date() } },
        ],
      };
    } else if (tab == 1) {
      //upcoming leads
      whereCondition = {
        status: 1,
        lead_origin_date: { [Op.gte]: new Date() },
      };
    } else if (tab == 2) {
      //intrested
      whereCondition = {
        status: 2,
      };
    } else if (tab == 3) {
      whereCondition = {
        status: 3,
      };
    }
    whereCondition.LO_id = req.id;

    if (type == 0 || type == 1) whereCondition.type = type;

    const data = await Leads.count({
      where: whereCondition,
    });
    return res.status(200).json({ status: true, count: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting count" });
  }
};

//save file
const saveFile = async (file) => {
  try {
    const parentDir = path.join(__dirname, "..");
    const uploadDir = path.join(parentDir, "public/docs");
    const extension = path.extname(file.originalname);
    const timeStamp = Math.floor(Date.now() / 1000);
    const random = Math.floor(Math.random() * 1000000000);
    let fileName = `${timeStamp}${random}${extension}`;

    const filePath = path.join(uploadDir, fileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);
    return `${timeStamp}${random}${extension}`;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//update leads
const updateLeads = async (req, res) => {
  try {
    const {
      id,
      contacted_on,
      response,
      lead_origin_date,
      amount_interested,
      remarks,

      annual_income,
      address,
    } = req.body;
    console.log(req.files);
    let updateBody = {
      contacted_on,
      //response,
      status: response == "Interested" ? 2 : response == "CallBack" ? 1 : 3,
    };
    if (annual_income) updateBody.annual_income = annual_income;
    if (address) updateBody.address = address;

    if (updateBody.status == 1) {
      updateBody.lead_origin_date = lead_origin_date;
    }
    if (updateBody.status == 2) {
      updateBody.amount_interested = amount_interested;
    }

    //files that might be included
    //address_proof_doc
    //income_proof_doc
    //pan_doc
    //aadhar_doc
    for (let i = 0; i < req.files.length; i++) {
      const fileName = await saveFile(req.files[i]);
      updateBody[`${req.files[i].fieldname}`] = fileName;
    }

    const updateLead = await Leads.update(updateBody, {
      where: {
        id,
      },
    });

    //create entry in leads_conv_remarks if status=1||3
    if (updateBody.status == 1 || updateBody.status == 3) {
      let convBody = {
        lead_id: id,
        //lead_type: 0,
        response_type: updateBody.status,
        remarks,
      };
      const convEntry = await ConvRemarks.create(convBody);
    }

    return res
      .status(200)
      .json({ status: true, message: "leads status updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
};

const getDashData = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const newLeadsCount = await Leads.count({
      where: {
        LO_id: req.id,
        status: {
          [Op.in]: [0, 1],
        },
        lead_origin_date: { [Op.between]: [startOfDay, endOfDay] },
      },
    });

    const PendingLeadsCount = await Leads.count({
      where: {
        LO_id: req.id,
        [Op.or]: [{ status: 0 }, { status: 1 }],
        lead_origin_date: { [Op.lte]: new Date() },
      },
    });

    const TATBreachedCount = await Leads.count({
      where: {
        LO_id: req.id,
        [Op.or]: [{ status: 0 }, { status: 1 }],
        lead_origin_date: {
          [Op.lte]: new Date(new Date() - 10 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const upcomingLeadsCount = await Leads.count({
      where: {
        LO_id: req.id,
        lead_origin_date: { [Op.gt]: new Date() },
      },
    });
    return res.status(200).json({
      status: true,
      newLeadsCount,
      PendingLeadsCount,
      TATBreachedCount,
      upcomingLeadsCount,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while getting data" });
  }
};

const saveFileBuffer = async (fileBuffer, fileName) => {
  try {
    const parentDir = path.join(__dirname, "..");
    const uploadDir = path.join(parentDir, "public/docs");

    const splitArray = fileName.split(".");
    const extension = splitArray[splitArray.length - 1];
    const timeStamp = Math.floor(Date.now() / 1000);
    const random = Math.floor(Math.random() * 1000000000);
    let finalFileName = `${timeStamp}${random}.${extension}`;

    const filePath = path.join(uploadDir, finalFileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, fileBuffer);
    return `${timeStamp}${random}${extension}`;
  } catch (error) {
    return false;
  }
};

// loan_application_id, loan_type, required_amount,
// full_name, dob, gender, marital_status, phone_number,
// contact_address, email, nationality, permanent_address,
// aadhaar_number, pan_voter, property_documents, aadhaar_card_attachment,
// pan_voter_pic, bank_statement, created_on
const pushDataCFL = async (req, res) => {
  try {
    const {
      loan_application_id,
      loan_type,
      required_amount,
      full_name,
      dob,
      gender,
      marital_status,
      phone_number,
      contact_address,
      email,
      nationality,
      permanent_address,
      aadhaar_number,
      pan_voter,
      property_documents,
      aadhaar_card_attachment,
      pan_voter_pic,
      bank_statement,
    } = req.body;
    const cibilScore = Math.floor(Math.random() * (700 - 500 + 1)) + 500; //500-700
    //save data to website_cust_data
    const custDataParams = {
      cust_name: full_name,
      //city
      //state
      aadhar: aadhaar_number,
      PAN: pan_voter,
      cibil_score: cibilScore,
      phone_no: phone_number,
      DOB: dob,
      gender,
      marital_status,
      email,
      contact_address,
      nationality,
      permanent_address,
    };
    const custData = await WebsiteCustData.create(custDataParams);
    //generate lead if cibil>=600
    if (cibilScore >= 600) {
      //id, cust_database_id, type, status, contacted_on, lead_origin_date, amount_interested,
      //LO_id, annual_income, address_proof_doc, address, income_proof_doc, pan_doc, aadhar_doc,

      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const today = new Date(now.getTime() + istOffset);

      const leadDataParams = {
        cust_database_id: custData["id"],
        type: 0, //website lead
        loan_type,
        status: 0,
        lead_origin_date: today,
        amount_interested: required_amount,
      };

      const leadStatus = await Leads.create(leadDataParams);

      //saving aadhar docs
      for (let i = 0; i < aadhaar_card_attachment.length; i++) {
        const savedFileName = await saveFileBuffer(
          aadhaar_card_attachment[i].buffer,
          aadhaar_card_attachment[i].fileName
        );
        if (savedFileName) {
          const saveStatus = await UserDocs.create({
            lead_id: leadStatus["id"],
            doc_type: 0,
            fileName: savedFileName,
          });
        }
      }

      //property_documents
      for (let i = 0; i < property_documents.length; i++) {
        const savedFileName = await saveFileBuffer(
          property_documents[i].buffer,
          property_documents[i].fileName
        );
        if (savedFileName) {
          const saveStatus = await UserDocs.create({
            lead_id: leadStatus["id"],
            doc_type: 2,
            fileName: savedFileName,
          });
        }
      }

      //pan_voter_pic
      for (let i = 0; i < pan_voter_pic.length; i++) {
        const savedFileName = await saveFileBuffer(
          pan_voter_pic[i].buffer,
          pan_voter_pic[i].fileName
        );
        if (savedFileName) {
          const saveStatus = await UserDocs.create({
            lead_id: leadStatus["id"],
            doc_type: 1,
            fileName: savedFileName,
          });
        }
      }

      //bank_statement
      for (let i = 0; i < bank_statement.length; i++) {
        const savedFileName = await saveFileBuffer(
          bank_statement[i].buffer,
          bank_statement[i].fileName
        );
        if (savedFileName) {
          const saveStatus = await UserDocs.create({
            lead_id: leadStatus["id"],
            doc_type: 3,
            fileName: savedFileName,
          });
        }
      }
      return res
        .status(200)
        .json({ status: 200, message: "data pushed successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while pushing data" });
  }
};

module.exports = {
  getWebsiteRaw,
  getRawCountWebsite,
  getDataLakeeRaw,
  getRawCountDataLake,
  getLeads,
  getLeadsCount,
  updateLeads,
  getDashData,
};
