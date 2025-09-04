const express= require('express');
const {gstDetails}= require('../controllers/gst.controller');
const router= express.Router();


router.post("/gstDetails/:gstNo",gstDetails)

module.exports= router;