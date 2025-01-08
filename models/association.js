const WebsiteCustData = require("./websiteCustData");
const DatalakeCustData = require("./dataLakeCustData");
const Leads = require("./leads");
const ConvRemarks = require("./LeadsConvRemarks");
const Users = require("./users");
const CflBranch = require("./branch_cfl");
const UserDocs = require("./userDoc");

//datalake
Leads.hasOne(DatalakeCustData,{foreignKey:'id',sourceKey:'cust_database_id', as:'datalake_cust_data'});


//website 
Leads.hasOne(WebsiteCustData,{foreignKey:'id',sourceKey:'cust_database_id',as:'website_cust_data'});


//user branch mapping
Users.hasOne(CflBranch,{foreignKey:'id',sourceKey:'branch_id',as:'branch_details'});

Leads.hasMany(ConvRemarks,{foreignKey:'lead_id', as:'conv'});
ConvRemarks.belongsTo(Leads,{foreignKey:'lead_id'});

Users.hasMany(Leads,{foreignKey:'LO_id',as:'leads'});
Leads.belongsTo(Users,{foreignKey:'LO_id'});

Leads.hasMany(UserDocs,{foreignKey:'lead_id',as:'docs'});
UserDocs.belongsTo(Leads,{foreignKey:'lead_id'});





module.exports = { Leads,WebsiteCustData,ConvRemarks,DatalakeCustData,Users,UserDocs ,CflBranch};





// Policy.hasMany(PolicyStatus, { foreignKey: 'policy_id', as:'Policy_status' });
// PolicyStatus.belongsTo(Policy, { foreignKey: 'policy_id' });


// Policy.hasMany(PolicyStatusLog, { foreignKey: 'policy_id', as:'Policy_status_log' });
// PolicyStatusLog.belongsTo(Policy, { foreignKey: 'policy_id' });

// Policy.hasMany(File,{foreignKey:'policy_id', as:'policy_files'});
// File.belongsTo(Policy,{foreignKey:'policy_id'});

// //initiator details
// PolicyStatus.hasOne(User, { foreignKey: 'user_id', sourceKey:"approver_id",as: 'approver_details' });
// Policy.hasOne(User,{foreignKey:'user_id',sourceKey:'initiator_id',as:'initiator_details'});

// //pending at
// Policy.hasOne(User, { foreignKey: 'user_id', sourceKey:"pending_at_id",as: 'pending_at_details' });

// //reviewer details
// Policy.hasOne(User, { foreignKey: 'user_id', sourceKey:"reviewer_id",as: 'reviwer_details' });


//Policy.hasOne(PolicyUserGroup,{foreignKey:'policy_id',sourceKey:'id',as:'user_group'});



