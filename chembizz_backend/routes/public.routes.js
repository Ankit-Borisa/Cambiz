const express= require('express');
const getPincodeDetails = require('../controllers/publicApi.controller');
const router= express.Router();


router.get('/getPincodeDetails/:pincode',getPincodeDetails)


module.exports=router;