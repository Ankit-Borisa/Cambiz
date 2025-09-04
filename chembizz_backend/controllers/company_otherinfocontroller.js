const jwt = require('jsonwebtoken'); // Make sure to import the 'jsonwebtoken' library
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');

// company_otherinfoController.js
const Company_otherinfo = require('../models/company_otherinfo');
const Company = require('../models/company');
const { uploadToAzureBlob, deleteFromAzureBlob } = require('../utils/blobUpload');

const createCompany_otherinfo = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        const { company_id, logo, website, other_emailid, other_contactno, fb, insta, twitter, linkedin } = req.body;

        const existCompanyDetailsCheckEmail = await Company.findOne({ emailid: other_emailid });
        if (existCompanyDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in company information"
            });
        }

        const existCompanyDetailsCheckMobile = await Company.findOne({ emailid: other_emailid });
        if (existCompanyDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile already exists in company information"
            });
        }

        const newCompany_otherinfo = new Company_otherinfo({
            company_id,
            logo,
            website,
            other_emailid,
            other_contactno,
            fb,
            insta,
            twitter,
            linkedin
        });
        if (req.file) {
            let uploadResult = await uploadToAzureBlob(req.file);
            const uniqueFileName = uploadResult.uniqueFileName;

            console.log("receiving the logo file ....")

            newCompany_otherinfo.logo = uniqueFileName
        }
        //    if(req.files){
        //     let path =''
        //     req.files.forEach(function(files,index,arr){
        //         path =path+files.path+',';
        //     })
        //     path=path.substring(0,path.lastIndexOf(","));
        //     newCompany_otherinfo.logo=path;
        // }
        console.log('data before save:', req.body);
        const savedCompany_otherinfo = await newCompany_otherinfo.save();

        res.status(200).json({
            success: true,
            message: 'savedCompany_otherinfo successfully!',
            savedCompany_otherinfo: savedCompany_otherinfo,
        });
        //res.status(201).json({savedCompany_otherinfo});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const updateCompany_otherinfo = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        const { company_otherinfoId } = req.params; // Assuming company_id is in the route parameters
        const { logo, website, other_emailid, other_contactno, fb, insta, twitter, linkedin } = req.body;

        const existCompanyDetailsCheckEmail = await Company.findOne({ emailid: other_emailid });
        if (existCompanyDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in company information"
            });
        }

        const existCompanyDetailsCheckMobile = await Company.findOne({ mobile_num: other_contactno });
        if (existCompanyDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile number already exists in company information"
            });
        }

        // Find the existing Company_otherinfo by company_id
        const existingCompany_otherinfo = await Company_otherinfo.findOne({ _id: company_otherinfoId });

        if (!existingCompany_otherinfo) {
            return res.status(404).json({ success: false, message: 'company_otherinfo not found' });
        }

        // Update the fields if they are provided in the request body
        if (logo) {
            existingCompany_otherinfo.logo = logo;
        }
        if (website) {
            existingCompany_otherinfo.website = website;
        }
        if (other_emailid) {
            existingCompany_otherinfo.other_emailid = other_emailid;
        }
        if (other_contactno) {
            existingCompany_otherinfo.other_contactno = other_contactno;
        }
        if (fb) {
            existingCompany_otherinfo.fb = fb;
        }
        if (insta) {
            existingCompany_otherinfo.insta = insta;
        }
        if (twitter) {
            existingCompany_otherinfo.twitter = twitter;
        }
        if (linkedin) {
            existingCompany_otherinfo.linkedin = linkedin;
        }

        // Check if req.file exists and update the logo property
        if (req.file) {

            let uploadResult = await uploadToAzureBlob(req.file);
            const uniqueFileName = uploadResult.uniqueFileName;

            const existBanner = existingCompany_otherinfo?.logo;

            console.log("receiving the logo file ....")

            if (existBanner) {
                await deleteFromAzureBlob(existBanner);
            } else {
                console.log("No previous banner to delete");
            }

            existingCompany_otherinfo.logo = uniqueFileName;
        }

        console.log('data before update:', req.body);
        const updatedCompany_otherinfo = await existingCompany_otherinfo.save();

        res.status(200).json({
            success: true,
            message: 'updated_company_otherinfo successfully!',
            UpdatedCompany_otherinfo: updatedCompany_otherinfo,
        });
        // res.status(200).json({ success: true, updatedCompany_otherinfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};



//Company start here

const createCompany_otherinfos = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's company ID matches the requested company ID
        // if (decodedToken.companyId !== req.body.company_id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }

        const { logo, website, other_emailid, other_contactno, fb, insta, twitter, linkedin } = req.body;

        const existCompanyDetailsCheckEmail = await Company.findOne({ emailid: other_emailid });
        if (existCompanyDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in company information"
            });
        }

        const existCompanyDetailsCheckMobile = await Company.findOne({ mobile_num: other_contactno });
        if (existCompanyDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile number already exists in company information"
            });
        }

        const newCompanyOtherInfo = new Company_otherinfo({
            company_id: decodedToken.companyId,
            logo,
            website,
            other_emailid,
            other_contactno,
            fb,
            insta,
            twitter,
            linkedin
        });

        if (req.file) {

            // change 

            let uploadResult = await uploadToAzureBlob(req.file);
            const uniqueFileName = uploadResult.uniqueFileName;

            console.log("receiving the logo file ....");
            newCompanyOtherInfo.logo = uniqueFileName;
        }

        const savedCompanyOtherInfo = await newCompanyOtherInfo.save();

        res.status(200).json({
            success: true,
            message: 'Saved Company Other Info successfully!',
            savedCompanyOtherInfo: savedCompanyOtherInfo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



const updateCompanyOtherInfo = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's company ID matches the requested company ID
        // if (decodedToken.companyId !== req.params.company_id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }

        const { logo, website, other_emailid, other_contactno, fb, insta, twitter, linkedin } = req.body;

        const existCompanyDetailsCheckEmail = await Company.findOne({ emailid: other_emailid });
        if (existCompanyDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in company information"
            });
        }

        const existCompanyDetailsCheckMobile = await Company.findOne({ mobile_num: other_contactno });
        if (existCompanyDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile number already exists in company information"
            });
        }

        const { company_otherinfoId } = req.params;
        // Find the existing Company_otherinfo by company_id
        const existingCompanyOtherInfo = await Company_otherinfo.findOne({ _id: company_otherinfoId });

        if (!existingCompanyOtherInfo) {
            return res.status(404).json({ success: false, message: 'Company other info not found' });
        }

        // Update the fields if they are provided in the request body
        if (logo) {
            existingCompanyOtherInfo.logo = logo;
        }
        if (website) {
            existingCompanyOtherInfo.website = website;
        }
        if (other_emailid) {
            existingCompanyOtherInfo.other_emailid = other_emailid;
        }
        if (other_contactno) {
            existingCompanyOtherInfo.other_contactno = other_contactno;
        }
        if (fb) {
            existingCompanyOtherInfo.fb = fb;
        }
        if (insta) {
            existingCompanyOtherInfo.insta = insta;
        }
        if (twitter) {
            existingCompanyOtherInfo.twitter = twitter;
        }
        if (linkedin) {
            existingCompanyOtherInfo.linkedin = linkedin;
        }

        // Check if req.file exists and update the logo property
        if (req.file) {
            let uploadResult = await uploadToAzureBlob(req.file);
            const uniqueFileName = uploadResult.uniqueFileName;

            const existBanner = existingCompanyOtherInfo?.logo;

            existingCompanyOtherInfo.logo = uniqueFileName;

            console.log("receiving the logo file ....")

            if (existBanner) {
                await deleteFromAzureBlob(existBanner);
            } else {
                console.log("No previous banner to delete");
            }

            
        }

        // Save the updated Company_otherinfo
        const updatedCompanyOtherInfo = await existingCompanyOtherInfo.save();

        res.status(200).json({
            success: true,
            message: 'Company other info updated successfully!',
            updatedCompanyOtherInfo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateCompanyBanner = async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Missing token" });
      }
  
      const decodedToken = verifyAccessToken(token);
  
      if (!decodedToken.role || !decodedToken.companyId) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }
  
      // Check if the user's role is 'company'
      if (decodedToken.role !== "company") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

  
      // Upload file to Azure
      let uploadResult = await uploadToAzureBlob(req.file);
  
      const companyId = decodedToken.companyId;
      const uniqueFileName = uploadResult.uniqueFileName;
  
      const existDetail = await Company_otherinfo.findOne({
        company_id: companyId,
      });
      const existBanner = existDetail?.banner;
  
      // Update or create company info
      await Company_otherinfo.findOneAndUpdate(
        { company_id: companyId },
        { banner: uniqueFileName },
        { upsert: true, new: true } // Create if not found
      );
  
      // after all opration is success then we are deleting previous banner from azure.
      if (existBanner) {
        await deleteFromAzureBlob(existBanner);
      } else {
        console.log("No previous banner to delete");
      }
  
      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: error.message });
    }
  };



module.exports = {
    createCompany_otherinfo: [verifyToken, createCompany_otherinfo],
    updateCompany_otherinfo: [verifyToken, updateCompany_otherinfo],

    //company start here
    createCompany_otherinfos: [verifyToken, createCompany_otherinfos],
    updateCompanyOtherInfo: [verifyToken, updateCompanyOtherInfo],
    verifyAccessToken,
    updateCompanyBanner
};



