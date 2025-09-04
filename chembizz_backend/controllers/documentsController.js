const mongoose = require('mongoose');
const Documents = require('../models/documents');
const Certificate = require('../models/certificate');
const { body, validationResult } = require('express-validator');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");


const {Azure_Storage_Base_Url} = require("../utils/blobUrl");


// AddDocument
const addDocument = async (req, res) => {
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
    const { company_id, certificate_name, certificate_no, issue_date, valid_till } = req.body;

    // Check if the document already exists for the company
    const existingDocument = await Documents.findOne({ company_id, certificate_name });

    if (existingDocument) {
      console.log('document already exists for the company with the same certificate id.');
      return res.status(400).json({ error: 'document already exists for the company.' });
    }

    // Check if the document already exists for any company
    const anyCompanyDocument = await Documents.findOne({ certificate_name });

    if (anyCompanyDocument) {
      console.log('document with the same certificate id already exists for another company.');
      return res.status(400).json({ error: 'document with the same certificate id already exists for another company.' });
    }

    // Check if the document has expired
    const currentDate = new Date();
    if (new Date(valid_till) < currentDate) {
      console.log('document has expired. please upload a valid document.');
      return res.status(400).json({ error: 'document has expired. please upload a valid document.' });
    }

    // Check if no file is attached to the request
    if (!req.file) {
      return res.status(400).json({ error: 'no file attached. please upload a document.' });
    }

    let uploadResult = await uploadToAzureBlob(req.file);

    const uniqueFileName = uploadResult.uniqueFileName;

    // Document is valid, add it to the database
    const newDocument = new Documents({
      company_id,
      certificate_name,
      certificate_no,
      issue_date,
      valid_till,
      status: 'pending',
      // Prepend base URL to file path
      doc_file: uniqueFileName,
    });


    await newDocument.save();
    console.log('document added successfully.');

    // Return the full body of the created document in the response

    return res.status(201).json({ success: true, message: 'document added successfully.', document: newDocument });
  } catch (error) {
    console.error('error while adding document:', error);
    return res.status(500).json({ error: 'internal server error', details: error.message });
  }
};



// Get Document Details with Certificate Information
const getDocumentDetails = async (req, res) => {
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

    const documentDetails = await Documents.aggregate([
      // {
      //   $lookup: {
      //     from: 'certificates',
      //     localField: 'certificate_id',
      //     foreignField: '_id',
      //     as: 'certificateDetails',
      //   },
      // },
      {
        $project: {
          company_id: 1,
          _id: 1,
          certificate_name: 1,
          certificate_no: 1,
          issue_date: 1,
          valid_till: 1,
          status: 1,
          doc_file: 1,
          createdAt: 1,
          updatedAt: 1
        },
      },
    ]);

    if (!documentDetails || documentDetails.length === 0) {
      console.log('no documents found for the given company id.');
      return res.status(404).json({ error: 'no documents found' });
    }

    const updatedDocumentDetails = documentDetails.map(item => {
      return {
        ...item, // No need to convert to plain object as aggregation already returns plain objects
        doc_file: `${Azure_Storage_Base_Url}${item.doc_file}`
      };
    });


    console.log('document details with certificate information:', documentDetails);
    res.status(200).json({
      success: true,
      message: 'all documentDetails retrieved successfully!',
      documentDetails: updatedDocumentDetails,
    });
  } catch (error) {
    // console.error('error fetching document details:', error);
    res.status(500).json({ success: false, message: "document is emty!", data: [] });
  }
}




// Update document by ID
const updateDocumentById = async (req, res) => {
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
    // Destructure parameters and request body
    const { id } = req.params;
    const { company_id, certificate_name, certificate_no, issue_date, valid_till, status, doc_file } = req.body;

    // Find the existing document by ID
    const existingDocument = await Documents.findOne({ _id: id });

    if (!existingDocument) {
      return res.status(404).json({ error: 'document not found' });
    }

    // Update fields if they are provided in the request body
    if (company_id) {
      existingDocument.company_id = company_id;
    }
    if (certificate_name) {
      existingDocument.certificate_name = certificate_name;
    }
    if (certificate_no) {
      existingDocument.certificate_no = certificate_no;
    }
    if (issue_date) {
      existingDocument.issue_date = issue_date;
    }
    if (valid_till) {
      existingDocument.valid_till = valid_till;
    }
    if (status) {
      // Ensure status is either "active" or "inactive"
      if (status !== 'active' && status !== 'inactive') {
        return res.status(400).json({ error: 'invalid status. Status must be either "active" or "inactive"' });
      }
      existingDocument.status = status;
    }

  

    // // If doc_file exists in request body, process it (remove base URL)
    // let processedDocFile = doc_file ? (doc_file.startsWith(baseUrl) ? doc_file.replace(baseUrl, '') : doc_file) : existingDocument.doc_file;

    // Add new file from req.file if it exists
    if (req.file) {

      let uploadResult = await uploadToAzureBlob(req.file);

      const uniqueFileName = uploadResult.uniqueFileName;

      const existDoc = existingDocument?.doc_file;

      console.log("receiving the doc file ....");

      if (existDoc) {
        await deleteFromAzureBlob(existDoc);
      } else {
        console.log("No previous doc to delete");
      }

      existingDocument.doc_file = uniqueFileName;
    }

    

    const updatedDocument = await existingDocument.save();

    res.status(200).json({
      success: true,
      message: 'document updated successfully',
      updatedDocument: updatedDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

///////////////////////////////////////////////////////////////////////////////////////

//Company Start here
// AddDocument
const addDocuments = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (this line is just for demonstration, replace with your actual token verification function)
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the provided company_id matches the company ID in the token
    // if (decodedToken.companyId !== req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
    // }

    const { certificate_name, certificate_no, issue_date, valid_till } = req.body;

    let company_id = decodedToken.companyId
    // Check if the document already exists for the company
    const existingDocument = await Documents.findOne({ company_id, certificate_name });

    if (existingDocument) {
      console.log('Document already exists for the company with the same certificate id.');
      return res.status(400).json({ error: 'Document already exists for the company.' });
    }

    // Check if the document already exists for any company
    // const anyCompanyDocument = await Documents.findOne({ certificate_name });

    // if (anyCompanyDocument) {
    //   console.log('Document with the same certificate id already exists for another company.');
    //   return res.status(400).json({ error: 'Document with the same certificate name already exists for another company.' });
    // }

    // Check if the document has expired
    const currentDate = new Date();
    if (new Date(valid_till) < currentDate) {
      console.log('Document has expired. Please upload a valid document.');
      return res.status(400).json({ error: 'Document has expired. Please upload a valid document.' });
    }

    // Check if no file is attached to the request
    if (!req.file) {
      return res.status(400).json({ error: 'No file attached. Please upload a document.' });
    }

    let uploadResult = await uploadToAzureBlob(req.file);

    const uniqueFileName = uploadResult.uniqueFileName;

    // Document is valid, add it to the database
    const newDocument = new Documents({
      company_id: company_id,
      certificate_name,
      certificate_no,
      issue_date,
      valid_till,
      status: 'pending',
      // Prepend base URL to file path
      doc_file: uniqueFileName,
    });

    await newDocument.save();
    console.log('Document added successfully.');

    // Return the full body of the created document in the response
    return res.status(201).json({ success: true, message: 'Document added successfully.', document: newDocument });
  } catch (error) {
    console.error('Error while adding document:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get Document Details with Certificate Information
const getDocumentsDetails = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (this line is just for demonstration, replace with your actual token verification function)
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }


    // Check if the provided company_id matches the company ID in the token
    // if (req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
    // }

    const documentDetails = await Documents.aggregate([
      {
        $match: {
          company_id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match company ID from decoded token
        }
      },
      // {
      //   $lookup: {
      //     from: 'certificates',
      //     localField: 'certificate_id',
      //     foreignField: '_id',
      //     as: 'certificateDetails',
      //   },
      // },
      {
        $project: {
          company_id: 1,
          _id: 1,
          certificate_name: 1,
          certificate_no: 1,
          issue_date: 1,
          valid_till: 1,
          status: 1,
          doc_file: 1,
          createdAt: 1,
          updatedAt: 1
          // 'certificateDetails.certificate_name': 1,
          // 'certificateDetails.createdAt': 1,
          // 'certificateDetails.updatedAt': 1,
        },
      },
    ]);


    if (!documentDetails || documentDetails.length === 0) {
      return res.status(200).json({ message: 'Document Not available' });
    }

    const updatedDocumentDetails = documentDetails.map(item => {
      return {
        ...item, // No need to convert to plain object as aggregation already returns plain objects
        doc_file: `${Azure_Storage_Base_Url}${item.doc_file}`
      };
    });

    res.status(200).json({
      success: true,
      message: 'All document details retrieved successfully!',
      documentDetails: updatedDocumentDetails,
    });
  } catch (error) {
    // console.error('Error fetching document details:', error);
    res.status(500).json({ success: false, message: "document not found!", data: [] });
  }
}



// Update document by ID
const updateDocumentsById = async (req, res) => {
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

    // Check if the provided company_id matches the company ID in the token
    // if (req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
    // }
    // Destructure parameters and request body
    const { id } = req.params;
    const { certificate_name, certificate_no, issue_date, valid_till, status, doc_file } = req.body;

    const existingDocument = await Documents.findOne({ _id: id });

    if (!existingDocument) {
      return res.status(404).json({ error: 'document not found' });
    }

    let company_id = decodedToken.companyId
    // Check if the document already exists for the company
    if (certificate_name && certificate_name !== existingDocument.certificate_name) {
      const existingCertificateName = await Documents.findOne({ company_id, certificate_name });

      if (existingCertificateName) {
        console.log('Document already exists for the company with the same certificate name.');
        return res.status(400).json({ error: 'Document already exists for the company with the same certificate name.' });
      }
    }



    if (certificate_name) {
      existingDocument.certificate_name = certificate_name;
    }
    if (certificate_no) {
      existingDocument.certificate_no = certificate_no;
    }
    if (issue_date) {
      existingDocument.issue_date = issue_date;
    }
    if (valid_till) {
      existingDocument.valid_till = valid_till;
    }
    // if (doc_file) {
    //   // Prepend base URL to the file path
    //   existingDocument.doc_file = req.body.doc_file;
    // }

    // // Update document file if a new file is attached to the request
    // if (req.file) {
    //   existingDocument.doc_file = req.file.filename;
    // }


    // // If doc_file exists in request body, process it (remove base URL)
    // let processedDocFile = doc_file ? (doc_file.startsWith(baseUrl) ? doc_file.replace(baseUrl, '') : doc_file) : existingDocument.doc_file;

    // Add new file from req.file if it exists
    if (req.file) {


      let uploadResult = await uploadToAzureBlob(req.file);

      const uniqueFileName = uploadResult.uniqueFileName;

      const existDoc = existingDocument?.doc_file;

      console.log("receiving the doc file ....");

      if (existDoc) {
        await deleteFromAzureBlob(existDoc);
      } else {
        console.log("No previous doc to delete");
      }

      existingDocument.doc_file = uniqueFileName;

    }

 

    const updatedDocument = await existingDocument.save();

    res.status(200).json({
      success: true,
      message: 'document updated successfully',
      updatedDocument: updatedDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//
// Get Document Details with Certificate Information
const getDocumentsDetail = async (req, res) => {
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

    // Fetch documents belonging to the company associated with the token
    const documentDetails = await Documents.find({ company_id: decodedToken.companyId })
    // .populate('certificate_id', 'certificate_name createdAt updatedAt'); // Populate certificate details

    if (!documentDetails || documentDetails.length === 0) {
      console.log('No documents found for the given company ID.');
      return res.status(200).json({ message: 'No documents available' });
    }

    const updatedDocumentDetails = documentDetails.map(item => {
      return {
        ...item.toObject(), // Convert the Mongoose document to a plain object
        doc_file: `${Azure_Storage_Base_Url}${item.doc_file}`
      };
    });


    res.status(200).json({
      success: true,
      message: 'All document details retrieved successfully!',
      documentDetails: updatedDocumentDetails,
    });
  } catch (error) {
    // console.error('Error fetching document details:', error);
    res.status(500).json({ success: false, message: "document is emty!", data: [] });
  }
}

// Get Document Details with Certificate Information
const getDocumentsDetail_cr = async (req, res) => {
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

    // Fetch documents belonging to the company associated with the token using aggregation
    const documentDetails = await Documents.aggregate([
      {
        $match: {
          company_id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match company ID from decoded token
        }
      },
      // {
      //   $lookup: {
      //     from: 'certificates',
      //     localField: 'certificate_id',
      //     foreignField: '_id',
      //     as: 'certificateDetails',
      //   },
      // },
      {
        $project: {
          company_id: 1,
          _id: 1,
          certificate_name: 1,
          certificate_no: 1,
          issue_date: 1,
          valid_till: 1,
          status: 1,
          doc_file: 1,
          createdAt: 1,
          updatedAt: 1,
          // 'certificateDetails.certificate_name': 1,
          // 'certificateDetails.createdAt': 1,
          // 'certificateDetails.updatedAt': 1,
        },
      },
    ]);

    if (!documentDetails || documentDetails.length === 0) {
      console.log('No documents found for the given company ID.');
      return res.status(200).json({ error: 'No documents available' });
    }

    const updatedDocumentDetails = documentDetails.map(item => {
      return {
        ...item, // No need to convert to plain object as aggregation already returns plain objects
        doc_file: `${Azure_Storage_Base_Url}${item.doc_file}`
      };
    });


    res.status(200).json({
      success: true,
      message: 'All document details retrieved successfully!',
      documentDetails: updatedDocumentDetails,
    });
  } catch (error) {
    console.error('Error fetching document details:', error);
    res.status(500).json({ success: false, message: "document is emty!", data: [] });
  }
}


module.exports = {
  addDocument: [verifyToken, addDocument],
  getDocumentDetails: [verifyToken, getDocumentDetails],
  updateDocumentById: [verifyToken, updateDocumentById],

  //Company start here
  addDocuments: [verifyToken, addDocuments],
  getDocumentsDetails: [verifyToken, getDocumentsDetails],
  updateDocumentsById: [verifyToken, updateDocumentsById],

  getDocumentsDetail: [verifyToken, getDocumentsDetail],
  getDocumentsDetail_cr: [verifyToken, getDocumentsDetail_cr],

  verifyAccessToken

};



