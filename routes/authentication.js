const express   = require('express');
const router    = express.Router();

const authCtrl = require('../controllers/authentication');




router.post('/login',authCtrl.login);

module.exports  = router;
