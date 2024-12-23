const express   = require('express');
const router    = express.Router();
const multer = require("multer");
const upload = multer();

const leadsCtrl = require('../controllers/leads');
const verifyJWT = require('../middleware/verifyJwt');



router.get('/get-leads',verifyJWT,leadsCtrl.getLeads)
router.get('/get-leads-count',verifyJWT,leadsCtrl.getLeadsCount);
router.get('/get-dashboard-data',verifyJWT,leadsCtrl.getDashData);

router.post('/update-lead',verifyJWT,upload.any(),leadsCtrl.updateLeads);



router.get('/get-website-raw',verifyJWT,leadsCtrl.getWebsiteRaw);
router.get('/get-website-raw-count',verifyJWT,leadsCtrl.getRawCountWebsite);

router.get('/get-datalake-raw',leadsCtrl.getDataLakeeRaw);
router.get('/get-datalake-raw-count',leadsCtrl.getRawCountDataLake);

module.exports  = router;
