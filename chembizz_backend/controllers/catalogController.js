const express = require('express');
const catalogRoutes = express.Router();
const Catalog = require('../models/catelog');
const { verifyAccessToken, verifyToken } = require('../middleware/generateAccessToken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const package_booking_schema = require("../models/package_booking");
const plan_schema = require("../models/membership_plan_schema");
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");
const {Azure_Storage_Base_Url} = require("../utils/blobUrl")

// Middleware: Verify Token
catalogRoutes.use(verifyToken);

// Create a new catalog with a single file upload
// const addCatalog = async (req, res) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role) {
//       return res.status(403).json({ success: false, message: 'unauthorized access' });
//     }

//     // Proceed to add inquiry if the user has the required role
//     // Check if the user's role is 'superadmin', 'admin'
//     if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'unauthorized access' });
//     }
//     // const COA =  req.file.filename; // Construct full URL for the uploaded file
//     const COA = baseURL + req.file.filename;

//     const {
//       company_id,
//       product_id,
//       category,
//       subcategory,
//       grade,
//       // COA,
//       min_price,
//       max_price,
//       qty,
//       qty_type,
//       active_chemicals,
//       status,
//       country_origin,
//       supply_capacity,
//       purity,
//       one_lot_qty,
//       one_lot_qty_type,
//       one_lot_qty_price,
//       max_lot_qty,
//       sample_price
//     } = req.body;

//     // Check if no file is attached to the request
//     if (!req.file) {
//       return res.status(400).json({ error: 'no file attached' });
//     }


//     const newCatalog = new Catalog({
//       company_id,
//       product_id,
//       category,
//       subcategory,
//       grade,
//       COA,
//       min_price,
//       max_price,
//       qty,
//       qty_type,
//       active_chemicals,
//       status,
//       country_origin,
//       supply_capacity,
//       purity,
//       one_lot_qty,
//       one_lot_qty_type,
//       one_lot_qty_price,
//       max_lot_qty,
//       sample_price
//     });

//     // Save the new catalog
//     const savedCatalog = await newCatalog.save();

//     // Send the saved catalog in the response
//     res.status(201).json({
//       success: true,
//       message: 'catalog added successfully',
//       catalog: savedCatalog
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: `internal server error: ${error.message}` });
//   }
// };


const editCatalogById = async (req, res) => {
  const { catalogId } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = verifyAccessToken(token);

    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    const existingCatalog = await Catalog.findOne({_id:catalogId });

    const updateFields = {};

    // Check if the file is attached to the request
    if (req.file) {

      let uploadResult = await uploadToAzureBlob(req.file);

      const uniqueFileName = uploadResult.uniqueFileName;

      const existCoa = existingCatalog?.COA;

      console.log("receiving the coa file ....");

      if (existCoa) {
        await deleteFromAzureBlob(existCoa);
      } else {
        console.log("No previous coa to delete");
      }

      const updatedCOA = req.file.filename;
      updateFields.COA = uniqueFileName;
    }

    // Extract fields from the request body and add them to updateFields
    const {
      category,
      subcategory,
      grade,
      min_price,
      max_price,
      qty,
      qty_type,
      hsn_code,
      active_chemicals,
      status,
      country_origin,
      supply_capacity,
      purity,
      one_lot_qty,
      one_lot_qty_type,
      one_lot_qty_price,
      max_lot_qty,
      sample_price
    } = req.body;

    if (category) updateFields.category = category;
    if (subcategory) updateFields.subcategory = subcategory;
    if (grade) updateFields.grade = grade;
    if (min_price) updateFields.min_price = min_price;
    if (max_price) updateFields.max_price = max_price;
    if (hsn_code) updateFields.hsn_code = hsn_code;
    if (qty) updateFields.qty = qty;
    if (qty_type) updateFields.qty_type = qty_type;
    if (active_chemicals) updateFields.active_chemicals = active_chemicals;
    if (status) updateFields.status = status;
    if (country_origin) updateFields.country_origin = country_origin;
    if (supply_capacity) updateFields.supply_capacity = supply_capacity;
    if (purity) updateFields.purity = purity;
    if (one_lot_qty) updateFields.one_lot_qty = one_lot_qty;
    if (one_lot_qty_type) updateFields.one_lot_qty_type = one_lot_qty_type;
    if (one_lot_qty_price) updateFields.one_lot_qty_price = one_lot_qty_price;
    if (max_lot_qty) updateFields.max_lot_qty = max_lot_qty;
    if (sample_price) updateFields.sample_price = sample_price;

    // Add updatedAt field
    updateFields.updatedAt = Date.now();

    // Find and update the catalog by ID
    const updatedCatalog = await Catalog.findByIdAndUpdate(catalogId, { $set: updateFields }, { new: true });

    if (!updatedCatalog) {
      return res.status(404).json({ error: 'catalog not found' });
    }

    res.status(200).json({
      success: true,
      message: 'catalog details updated successfully',
      catalog: updatedCatalog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};




// Display list of catalogs with associated product details
const getCatalogs = async (req, res) => {
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

  
    // Use the aggregation framework to join catalogs with products
    const catalogsWithProducts = await Catalog.aggregate([

      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id', // Use 'product_id' instead of '_id' for matching
          as: 'productDetails',
        },
      },
      //  { $unwind: '$productDetails' }, // Corrected: Changed 'category' to 'categoryDetails'

      {
        $project: {
          company_id: 1,
          _id: 1,
          COA: 1,
          category: 1,
          subcategory: 1,
          product_id: 1,
          grade: 1,
          COA: 1,
          min_price: 1,
          max_price: 1,
          qty: 1,
          hsn_code: 1,
          qty_type: 1,
          active_chemicals: 1,
          status: 1,
          country_origin: 1,
          supply_capacity: 1,
          purity: 1,
          one_lot_qty: 1,
          one_lot_qty_type: 1,
          one_lot_qty_price: 1,
          max_lot_qty: 1,
          sample_price: 1,
          createdAt: 1,
          updatedAt: 1,
          'productDetails.product_id': 1,
          'productDetails.CAS_number': 1,
          'productDetails.name_of_chemical': 1,
          'productDetails.structure': 1,
          'productDetails.molecularFormula': 1,
          'productDetails.mol_weight': 1,
          'productDetails.synonums': 1,
          'productDetails.status': 1,
          'productDetails.IUPAC_name': 1,
          'productDetails.Appearance': 1,
          'productDetails.Appearance': 1,
          'productDetails.storage': 1,
          'productDetails.createdAt': 1,
          'productDetails.updatedAt': 1,
        },
      },
    ]);

    if (!catalogsWithProducts || catalogsWithProducts.length === 0) {
      return res.status(404).json({ message: 'catelog is emty!', data: [] });
    }

    catalogsWithProducts.forEach(catalog => {
      if (catalog.COA) {
        catalog.COA = `${Azure_Storage_Base_Url}${catalog.COA}`;
      }
      if (catalog.productDetails && catalog.productDetails.length > 0) {
        catalog.productDetails.forEach(product => {
          if (product.structure) {
            product.structure = `${Azure_Storage_Base_Url}${product.structure}`;
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      message: 'all catalogsWithProducts retrieved successfully!',
      CatalogsWithProducts: catalogsWithProducts,
    });
    // res.status(200).json(catalogsWithProducts);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: "catelog is emty!", data: [] });
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Company Start here
// Create a new catalog with a single file upload

// const addCatalogs = async (req, res) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token (this line is just for demonstration, replace with your actual token verification function)
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
//     // if (decodedToken.companyId !== req.body.company_id) {
//     //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
//     // }
//     // const COA =  req.file.filename; // Construct full URL for the uploaded file
//     const COA = req.file.filename;

//     const {
//       product_id,
//       category,
//       subcategory,
//       grade,
//       min_price,
//       max_price,
//       qty,
//       qty_type,
//       hsn_code,
//       active_chemicals,
//       status,
//       country_origin,
//       supply_capacity,
//       purity,
//       one_lot_qty,
//       one_lot_qty_type,
//       one_lot_qty_price,
//       max_lot_qty,
//       sample_price
//     } = req.body;

//     // Check if no file is attached to the request
//     if (!req.file) {
//       return res.status(400).json({ error: 'no file attached' });
//     }

//     // Check if a catalog with the same product ID already exists
//     const existingCatalog = await Catalog.findOne({ company_id: decodedToken.companyId, product_id: product_id });

//     if (existingCatalog) {
//       return res.status(400).json({
//         success: false,
//         message: "Product Id Already Exists"
//       });
//     }

//     const newCatalog = new Catalog({
//       company_id: decodedToken.companyId,
//       product_id,
//       category,
//       subcategory,
//       grade,
//       COA,
//       min_price,
//       max_price,
//       qty,
//       qty_type,
//       hsn_code,
//       active_chemicals,
//       status,
//       country_origin,
//       supply_capacity,
//       purity,
//       one_lot_qty,
//       one_lot_qty_type,
//       one_lot_qty_price,
//       max_lot_qty,
//       sample_price
//     });

//     // Save the new catalog
//     const savedCatalog = await newCatalog.save();

//     // Send the saved catalog in the response
//     res.status(200).json({
//       success: true,
//       message: 'Catalog added successfully',
//       catalog: savedCatalog
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   }
// };

const addCatalogs = async (req, res) => {
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

    // Check if no file is attached to the request
    if (!req.file) {
      return res.status(400).json({ error: 'No file attached' });
    }

    let uploadResult = await uploadToAzureBlob(req.file);

    const uniqueFileName = uploadResult.uniqueFileName;
    console.log("receiving the coa file ....");

    // Extract the uploaded file
    const COA = uniqueFileName;

    const {
      product_id,
      category,
      subcategory,
      grade,
      min_price,
      max_price,
      qty,
      qty_type,
      hsn_code,
      active_chemicals,
      status,
      country_origin,
      supply_capacity,
      purity,
      one_lot_qty,
      one_lot_qty_type,
      one_lot_qty_price,
      max_lot_qty,
      sample_price
    } = req.body;

    

    // Find the membership plan details to get the catalog limit
    const booking = await package_booking_schema.findOne({ company_id: decodedToken.companyId });
    const catalogLimitData = await plan_schema.findOne({ _id: booking.plan_id });

    // Extract the catalog limit from the plan
    const catalogLimit = catalogLimitData.catalog_limit;

    // Check if the status is 'active' and the company has reached its catalog limit for active catalogs
    if (active_chemicals === 'active') {
      // Get the count of active catalogs for this company
      const activeCatalogCount = await Catalog.countDocuments({
        company_id: decodedToken.companyId,
        active_chemicals: 'active'
      });

      // If the active catalog count is equal to or exceeds the limit, prevent adding more active catalogs
      if (activeCatalogCount >= catalogLimit) {
        return res.status(400).json({
          success: false,
          message: `Catalog limit reached. You can only have ${catalogLimit} active products.`
        });
      }
    }

    // Check if a catalog with the same product ID already exists
    const existingCatalog = await Catalog.findOne({ company_id: decodedToken.companyId, product_id });

    if (existingCatalog) {
      return res.status(400).json({
        success: false,
        message: 'Product ID already exists'
      });
    }

    // Create the new catalog
    const newCatalog = new Catalog({
      company_id: decodedToken.companyId,
      product_id,
      category,
      subcategory,
      grade,
      COA,
      min_price,
      max_price,
      qty,
      qty_type,
      hsn_code,
      active_chemicals,
      status,
      country_origin,
      supply_capacity,
      purity,
      one_lot_qty,
      one_lot_qty_type,
      one_lot_qty_price,
      max_lot_qty,
      sample_price
    });

    // Save the new catalog
    const savedCatalog = await newCatalog.save();

    // Send the saved catalog in the response
    res.status(200).json({
      success: true,
      message: 'Catalog added successfully',
      catalog: savedCatalog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};



const editCatalogsById = async (req, res) => {
  const { catalogId } = req.params;
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

    // // Check if the provided company_id matches the company ID in the token
    // if (req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
    // }

    const existingCatalog = await Catalog.findOne({_id:catalogId });

    const updateFields = {};

    // Check if the file is attached to the request
    if (req.file) {
      let uploadResult = await uploadToAzureBlob(req.file);

      const uniqueFileName = uploadResult.uniqueFileName;

      const existCoa = existingCatalog?.COA;

      console.log("receiving the coa file ....");

      if (existCoa) {
        await deleteFromAzureBlob(existCoa);
      } else {
        console.log("No previous coa to delete");
      }

      updateFields.COA = uniqueFileName;
    }

    // Extract fields from the request body and add them to updateFields
    const {
      category,
      subcategory,
      grade,
      min_price,
      max_price,
      qty,
      qty_type,
      hsn_code,
      active_chemicals,
      status,
      country_origin,
      supply_capacity,
      purity,
      one_lot_qty,
      one_lot_qty_type,
      one_lot_qty_price,
      max_lot_qty,
      sample_price
    } = req.body;

    if (category) updateFields.category = category;
    if (subcategory) updateFields.subcategory = subcategory;
    if (grade) updateFields.grade = grade;
    if (min_price) updateFields.min_price = min_price;
    if (max_price) updateFields.max_price = max_price;
    if (qty) updateFields.qty = qty;
    if (qty_type) updateFields.qty_type = qty_type;
    if (hsn_code) updateFields.hsn_code = hsn_code;
    if (active_chemicals) updateFields.active_chemicals = active_chemicals;
    if (status) updateFields.status = status;
    if (country_origin) updateFields.country_origin = country_origin;
    if (supply_capacity) updateFields.supply_capacity = supply_capacity;
    if (purity) updateFields.purity = purity;
    if (one_lot_qty) updateFields.one_lot_qty = one_lot_qty;
    if (one_lot_qty_type) updateFields.one_lot_qty_type = one_lot_qty_type;
    if (one_lot_qty_price) updateFields.one_lot_qty_price = one_lot_qty_price;
    if (max_lot_qty) updateFields.max_lot_qty = max_lot_qty;
    if (sample_price) updateFields.sample_price = sample_price;

    // Add updatedAt field
    updateFields.updatedAt = Date.now();

    // Find and update the catalog by ID
    const updatedCatalog = await Catalog.findByIdAndUpdate(catalogId, { $set: updateFields }, { new: true });

    if (!updatedCatalog) {
      return res.status(404).json({ error: 'catalog not found' });
    }

    res.status(200).json({
      success: true,
      message: 'catalog details updated successfully',
      catalog: updatedCatalog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};



// Display list of catalogs with associated product details for the company
const getCatalog = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (replace with actual token verification function)
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    

    // Use the aggregation framework to join catalogs with products for the company
    const catalogsWithProducts = await Catalog.aggregate([
      {
        $match: {
          company_id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match catalogs with the company ID from the token
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          company_id: 1,
          _id: 1,
          COA: 1,
          category: 1,
          subcategory: 1,
          product_id: 1,
          grade: 1,
          min_price: 1,
          max_price: 1,
          qty: 1,
          qty_type: 1,
          hsn_code: 1,
          active_chemicals: 1,
          status: 1,
          country_origin: 1,
          supply_capacity: 1,
          purity: 1,
          one_lot_qty: 1,
          one_lot_qty_type: 1,
          one_lot_qty_price: 1,
          max_lot_qty: 1,
          sample_price: 1,
          createdAt: 1,
          updatedAt: 1,
          'productDetails.product_id': 1,
          'productDetails.CAS_number': 1,
          'productDetails.name_of_chemical': 1,
          'productDetails.structure': 1,
          'productDetails.molecularFormula': 1,
          'productDetails.mol_weight': 1,
          'productDetails.synonums': 1,
          'productDetails.status': 1,
          'productDetails.IUPAC_name': 1,
          'productDetails.Appearance': 1,
          'productDetails.storage': 1,
          'productDetails.createdAt': 1,
          'productDetails.updatedAt': 1,
        },
      },
    ]);

    // Check if catalogs with products exist for the company
    if (!catalogsWithProducts || catalogsWithProducts.length === 0) {
      return res.status(200).json({ message: 'catelog Not available!', data: [] });
    }

    catalogsWithProducts.forEach(catalog => {
      if (catalog.COA) {
        catalog.COA = `${Azure_Storage_Base_Url}${catalog.COA}`;
      }
      if (catalog.productDetails && catalog.productDetails.length > 0) {
        catalog.productDetails.forEach(product => {
          if (product.structure) {
            product.structure = `${Azure_Storage_Base_Url}${product.structure}`;
          }
        });
      }
    });

    // Send success response with the retrieved catalogs and their associated products for the company
    res.status(200).json({
      success: true,
      message: 'Catalogs with associated products retrieved successfully for the company!',
      catalogs: catalogsWithProducts,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: "catelog is emty!", data: [] });
  }
};



//
const displayCompanyCatalogs = async (req, res) => {
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
    //   return res.status(403).json({ success: false, message: 'Unauthorized access to view catalogs for this company' });
    // }

    // Assuming Catalog is the mongoose model for the catalogs collection
    const catalogs = await Catalog.find({ company_id: decodedToken.companyId });

    const catalogDetailsDisplay = catalogs.map(detail => {
      return {
        ...detail._doc, // Spread the original bank detail document
        COA: Azure_Storage_Base_Url + detail.COA // Add the full URL for the cancel cheque photo
      };
    });

    // Send the catalogs in the response
    res.status(200).json({
      success: true,
      message: 'Catalogs retrieved successfully',
      catalogs: catalogDetailsDisplay
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

const getCatalogById = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (replace with actual token verification function)
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if catalog ID is provided in the request
    // if (!req.params.catalogId) {
    //   return res.status(400).json({ success: false, message: 'Catalog ID is required' });
    // }
  

    // Use the aggregation framework to join catalogs with products and filter by catalog ID
    const catalogWithProducts = await Catalog.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.catalogId), // Match catalog ID from request
          company_id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match catalogs with the company ID from the token
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          company_id: 1,
          _id: 1,
          COA: 1,
          category: 1,
          subcategory: 1,
          product_id: 1,
          grade: 1,
          min_price: 1,
          max_price: 1,
          qty: 1,
          qty_type: 1,
          hsn_code: 1,
          active_chemicals: 1,
          status: 1,
          country_origin: 1,
          supply_capacity: 1,
          purity: 1,
          one_lot_qty: 1,
          one_lot_qty_type: 1,
          one_lot_qty_price: 1,
          max_lot_qty: 1,
          sample_price: 1,
          createdAt: 1,
          updatedAt: 1,
          'productDetails._id': 1, // Corrected to '_id'
          'productDetails.CAS_number': 1,
          'productDetails.name_of_chemical': 1,
          'productDetails.structure': 1,
          'productDetails.molecularFormula': 1,
          'productDetails.mol_weight': 1,
          'productDetails.synonyms': 1, // Corrected to 'synonyms'
          'productDetails.status': 1,
          'productDetails.IUPAC_name': 1,
          'productDetails.Appearance': 1,
          'productDetails.storage': 1,
          'productDetails.createdAt': 1,
          'productDetails.updatedAt': 1,
        },
      },
    ]);

    // Check if catalogs with products exist for the given catalog ID
    if (!catalogWithProducts || catalogWithProducts.length === 0) {
      return res.status(200).json({ message: 'catelog not available!' });
    }

    catalogWithProducts.forEach(catalog => {
      if (catalog.COA) {
        catalog.COA = `${Azure_Storage_Base_Url}${catalog.COA}`;
      }
      if (catalog.productDetails && catalog.productDetails.length > 0) {
        catalog.productDetails.forEach(product => {
          if (product.structure) {
            product.structure = `${Azure_Storage_Base_Url}${product.structure}`;
          }
        });
      }
    });

    // Send success response with the retrieved catalog and its associated products
    res.status(200).json({
      success: true,
      message: 'Catalog retrieved successfully!',
      catalogWithProducts: catalogWithProducts[0], // Assuming only one catalog is retrieved
    });

  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: "catelog is emty!", data: [] });
  }
};


const catalogStatusUpdate = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (replace with actual token verification function)
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }
    let { catalogId } = req.body
    let updateData = {
      active_chemicals: req.body.active_chemicals
    }
    let statusUpdateData = await Catalog.findByIdAndUpdate(catalogId, updateData, { new: true });
    res.status(200).json({
      success: true,
      message: 'catalog Status updated successfully',
      catalog: statusUpdateData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "catelog is emty!", data: [] });
  }
}


module.exports = {
  // addCatalog: [verifyToken, addCatalog],
  editCatalogById: [verifyToken, editCatalogById],
  getCatalogs: [verifyToken, getCatalogs],

  //Company Start here
  addCatalogs: [verifyToken, addCatalogs],
  editCatalogsById: [verifyToken, editCatalogsById],
  getCatalog: [verifyToken, getCatalog],
  displayCompanyCatalogs: [verifyToken, displayCompanyCatalogs],
  catalogStatusUpdate: [verifyToken, catalogStatusUpdate],

  getCatalogById: [verifyToken, getCatalogById],
  verifyAccessToken
};




