const Leads = require("../models/Leads");
const WebsiteCustData = require("../models/websiteCustData");
const DatalakeCustData = require("../models/dataLakeCustData");

const generateWebsiteLeads = async () => {
  try {
    const websiteCustDataRaw = await WebsiteCustData.findAll();
    for (let i = 0; i < websiteCustDataRaw.length; i++) {
      if (websiteCustDataRaw[i]["cibil_score"] > 650) {
        const createLead = await WebsiteLeads.create({
          website_cust_database_id: websiteCustDataRaw[i]["id"],
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//scheduler function
const generateDatalakeLeads = async () => {
  try {
    const custData = await DatalakeCustData.findAll({
      where: {
        lead_generated: 0,
      },
    });
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const today = new Date(now.getTime() + istOffset);
    for (let i = 0; i < custData.length; i++) {
      let endDate1 = new Date(custData[i]["loan1_end_date"]);
      let endDate2 = new Date(custData[i]["loan2_end_date"]);
      let endDate3 = new Date(custData[i]["loan3_end_date"]);
      const differenceInTime = Math.min(
         endDate1 - today,
         endDate2- today,
         endDate3- today
      );
      const difference = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
      //if difference is less than 3 days, generate a lead
      if (difference <= 3) {
        console.log(`i - ${i}, difference - ${difference}`);
        await Leads.create({
          cust_database_id: custData[i]["id"],
          type: 1,
          status: 0,
          lead_origin_date: today,
          LO_id:(Math.random() < 0.5 ? 1 : 2)
        });
        //update the datalake_cust_database
        await custData[i].update({
            lead_generated:1
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
};

generateDatalakeLeads();

//generateWebsiteLeads();
