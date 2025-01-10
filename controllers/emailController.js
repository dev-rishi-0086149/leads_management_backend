const path = require("path");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const { where, Op, Sequelize } = require("sequelize");
//require("dotenv").config();

const {
  WebsiteCustData,
  Leads,
  ConvRemarks,
  DatalakeCustData,
  Users,
} = require("../models/association");

const newLeadEmailTrigger = async (req, res) => {
  try {
    // const emailUserName = process.env.EMAIL_USER;
    // const emailPass = process.env.EMAIL_PASS;
    const emailUserName = "#";
    const emailPass = "#";
    const transporter = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        user: emailUserName,
        pass: emailPass,
      },
      pool: true, // Enable connection pooling
      maxConnections: 5, // Limit concurrent connections
      rateLimit: true, // Enable rate limiting
      rateDelta: 1000, // 1-second delay between emails
      rateLimit: 5, // Max 5 emails per second
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const userData = await Users.findAll();
    for (let i = 0; i < userData.length; i++) {
      const leadDetails = await Leads.findAll({
        where: {
          LO_id: userData[i]["id"],
          status: {
            [Op.in]: [0,1]  
          },
          lead_origin_date: { [Op.between]: [startOfDay, endOfDay] },
        },
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
        //raw: true
      });
      console.log(leadDetails.length);
      if (leadDetails.length > 0) {
        //trigger email for new leads reminders
        let relativeEmailTemplatePath =
          "../templates/newLeadsEmailTemplate.ejs";
        const emailTemplatePath = path.join(
          __dirname,
          relativeEmailTemplatePath
        );
        let customLeadDetails = leadDetails.map((leads) => {
          console.log(leads);
          let tempObj = {
            id: leads.id,
            name:
              leads["type"] == 1
                ? leads["datalake_cust_data"]["cust_name"]
                : leads["website_cust_data"]["cust_name"],
            mobile:
              leads["type"] == 1
                ? leads["datalake_cust_data"]["phone_no"]
                : leads["website_cust_data"]["phone_no"],
            aadhar:
              leads["type"] == 1
                ? leads["datalake_cust_data"]["aadhar"]
                : leads["website_cust_data"]["aadhar"],
          };
          return tempObj;
        });
        dynamicData = {
          emp_name: userData[i]["emp_name"],
          leads: customLeadDetails,
        };
        const emailHtml = await ejs.renderFile(emailTemplatePath, dynamicData);
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const to = userData[i]["emp_email"];
        console.log(userData[i]["emp_email"]);
        const from = emailUserName;
        console.log(from);
        let mailOptions = {
          from: from,
          to: to,
          subject: `New Leads Generated ${formattedDate}`,
          html: emailHtml,
        };
        transporter.sendMail(mailOptions);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const TATEmailTrigger = async (req, res) => {
  try {

    const emailUserName = "sramp.notifications@spandanasphoorty.com";
    const emailPass = "W5RCq20ZV2";
    const transporter = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        user: emailUserName,
        pass: emailPass,
      },
      pool: true, // Enable connection pooling
      maxConnections: 5, // Limit concurrent connections
      rateLimit: true, // Enable rate limiting
      rateDelta: 1000, // 1-second delay between emails
      rateLimit: 5, // Max 5 emails per second
    });

    const userData = await Users.findAll();

    const today = new Date();
    const dateTenDaysAgo = new Date(today);
    dateTenDaysAgo.setDate(today.getDate() - 10);

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + istOffset);

    for (let i = 0; i < userData.length; i++) {
      const leadDetails = await Leads.findAll({
        where: {
          LO_id: userData[i]["id"],
          status: {
            [Op.in]: [0,1] //not contacted or callback was requested
          },
          lead_origin_date: {
            [Op.lt]: dateTenDaysAgo,
          },
        },
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
      });
      console.log(leadDetails.length);
      if (leadDetails.length > 0) {
        let relativeEmailTemplatePath = "../templates/TATEmailTemplate.ejs";
        const emailTemplatePath = path.join(
          __dirname,
          relativeEmailTemplatePath
        );
        let customLeadDetails = leadDetails.map((leads) => {
          console.log(leads);
          let tempObj = {
            id: leads.id,
            cust_name:
              leads["type"] == 1
                ? leads["datalake_cust_data"]["cust_name"]
                : leads["website_cust_data"]["cust_name"],
            phone_no:
              leads["type"] == 1
                ? leads["datalake_cust_data"]["phone_no"]
                : leads["website_cust_data"]["phone_no"],
            aadhar:
              leads["type"] == 1
                ? leads["datalake_cust_data"]["aadhar"]
                : leads["website_cust_data"]["aadhar"],
            TimeElapsed: Math.floor(
              (nowIST - new Date(leads["lead_origin_date"])) / (1000 * 60 * 60 * 24)
            ),
          };

          return tempObj;
        });
        dynamicData = {
          emp_name: userData[i]["emp_name"],
          leads: customLeadDetails,
        };
        const emailHtml = await ejs.renderFile(emailTemplatePath, dynamicData);
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const to = userData[i]["emp_email"];
        console.log(userData[i]["emp_email"]);
        const from = emailUserName;
        console.log(from);
        let mailOptions = {
          from: from,
          to: to,
          subject: `TAT Breached`,
          html: emailHtml,
        };
        transporter.sendMail(mailOptions);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

newLeadEmailTrigger();
//TATEmailTrigger();

