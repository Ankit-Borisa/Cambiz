const mongoose = require("mongoose");
const Stamp = require("../models/stampsign");
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');

const fs = require("fs");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl");
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");




const insertStamp = async (req, res) => {
  try {
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
    // Check if file was uploaded with the request
    if (!req.files || !req.files.stampImage || !req.files.signImage) {
      return res.status(400).json({ success: false, message: 'Stamp image and sign image are required' });
    }
    const companyId = decodedToken.companyId;


    let uploadResultOfStamp = await uploadToAzureBlob(req.files.stampImage[0]);

    const uniqueFileNameOfStamp = uploadResultOfStamp.uniqueFileName;

    let uploadResultOfSign = await uploadToAzureBlob(req.files.signImage[0]);

    const uniqueFileNameOfSign = uploadResultOfSign.uniqueFileName;

    const stampImage = uniqueFileNameOfStamp;
    const signImage = uniqueFileNameOfSign;

    // Create a new stamp object
    const newStamp = new Stamp({
      companyId: companyId,
      stampImage: stampImage,
      signImage: signImage
    });

    // Save the stamp to the database
    const savedStamp = await newStamp.save();

    res.status(200).json({
      success: true,
      message: "Stamp added successfully",
      data: savedStamp
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


// const displaystamp = async (req, res) => {
//   const { companyId } = req.params;
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//       return res.status(403).json({ success: false, message: 'Unauthorized access' });
//     }

//     // Check if the user's role is 'company'
//     if (decodedToken.role !== 'company') {
//       return res.status(403).json({ success: false, message: 'Unauthorized access' });
//     }

//     // Check if the provided company_id matches the company ID in the token
//     if (req.body.company_id) {
//       return res.status(403).json({ success: false, message: 'Unauthorized access to add employee for this company' });
//     }


//     const stamp = await Stamp.findById(companyId);
//     if (!stamp) {
//       return res.status(404).json({ message: 'stamp not found' });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'stamp details retrieved successfully',
//       employee: stamp
//     });

//     // res.json(employee);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const displaystamp = async (req, res) => {
  // const { companyId } = req.params;
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token);

    // Ensure the token is valid and contains necessary information
    if (!decodedToken || !decodedToken.role) {
      // || !decodedToken.companyId
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user has the required role
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Query bank details from the database by ID
    const stampDetails = await Stamp.find({ companyId: decodedToken.companyId });

    // If bank details do not exist for this ID, return an error
    if (!stampDetails) {
      return res.status(200).json({ success: false, message: 'stamp details not Available' });
    }

     // Replace "your_base_url" with your actual base URL

    // Update stampImage and signImage URLs with base URL
    stampDetails.forEach(stamp => {
      if (stamp.stampImage) {
        stamp.stampImage = Azure_Storage_Base_Url + stamp.stampImage;
      }
      if (stamp.signImage) {
        stamp.signImage = Azure_Storage_Base_Url + stamp.signImage;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Stamp details retrieved successfully',
      // companyId: stamp.companyId,
      stampData: stampDetails
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateStamp = async (req, res) => {
  const { stampId } = req.params;

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

    // Find the existing stamp document
    const existingStamp = await Stamp.findById(stampId);
    if (!existingStamp) {
      return res.status(404).json({ message: 'Stamp data not found for the provided stamp ID' });
    }

    if (!req.files) {
      return res.status(400).json({ success: false, message: 'Stamp image or sign image is required' });
    }

    let updatedFields = {};

    // console.log("req.files.....",req.files);


    if (req.files.stampImage) {

      let uploadResultOfStamp = await uploadToAzureBlob(req.files.stampImage[0]);

      const uniqueFileNameOfStamp = uploadResultOfStamp.uniqueFileName;

      const existStamp = existingStamp?.stampImage;

      console.log("receiving the Stamp file ....");

      if (existStamp) {
        await deleteFromAzureBlob(existStamp);
      } else {
        console.log("No previous coa to delete");
      }


     
      updatedFields.stampImage = uniqueFileNameOfStamp;
    }

    if (req.files.signImage) {

      let uploadResultOfSign = await uploadToAzureBlob(req.files.signImage[0]);

      const uniqueFileNameOfSign = uploadResultOfSign.uniqueFileName;

      const existSign = existingStamp?.signImage;

      console.log("receiving the Sign file ....");

      if (existSign) {
        await deleteFromAzureBlob(existSign);
      } else {
        console.log("No previous sign image to delete");
      }

     
      updatedFields.signImage = uniqueFileNameOfSign;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No image provided for update' });
    }

    // Update stamp data associated with the provided stampId
    const updatedStamp = await Stamp.findByIdAndUpdate(
      stampId,
      {
        $set: {
          ...updatedFields,
          stamp_status: req.body.stamp_status,
          sign_status: req.body.sign_status
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Stamp data updated successfully',
      updatedStamp: updatedStamp
    });

  } catch (error) {
    console.log("error while updating stamp and sign",error)
    res.status(500).json({ error: error.message });
  }
};

// const updateStamp = async (req, res) => {
//   const { stampId } = req.params;

//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//       return res.status(403).json({ success: false, message: 'Unauthorized access' });
//     }

//     // Check if the user's role is 'company'
//     if (decodedToken.role !== 'company') {
//       return res.status(403).json({ success: false, message: 'Unauthorized access' });
//     }

//     // Find the existing stamp document
//     const existingStamp = await Stamp.findById(stampId);
//     if (!existingStamp) {
//       return res.status(404).json({ message: 'Stamp data not found for the provided stamp ID' });
//     }

//     // if (!req.files) {
//     //   return res.status(400).json({ success: false, message: 'Stamp image or sign image is required' });
//     // }

//     // let updatedFields = {};

//     // if (req.files.stampImage) {
//     //   const stampImage = req.files.stampImage[0].filename;
//     //   updatedFields.stampImage = stampImage;
//     // }

//     // if (req.files.signImage) {
//     //   const signImage = req.files.signImage[0].filename;
//     //   updatedFields.signImage = signImage;
//     // }

//     // if (Object.keys(updatedFields).length === 0) {
//     //   return res.status(400).json({ success: false, message: 'No image provided for update' });
//     // }

//     // Update stamp data associated with the provided stampId
//     const updatedStamp = await Stamp.findByIdAndUpdate(
//       stampId,
//       {
//         $set: {
//           stamp_status: req.body.stamp_status,
//           sign_status: req.body.sign_status
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Stamp data updated successfully',
//       updatedStamp: updatedStamp
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };





module.exports = {
  insertStamp: [verifyToken, insertStamp],
  displaystamp: [verifyToken, displaystamp],
  updateStamp: [verifyToken, updateStamp],
  verifyAccessToken
}
