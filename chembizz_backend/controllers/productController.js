const Product = require('../models/productModel');
const bcrypt = require('bcrypt');
//const { validationResult } = require('express-validator');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const productByCompany = require('../models/productByCompany');
const {Azure_Storage_Base_Url} = require("../utils/blobUrl");
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");




// // Create a new product with a single file upload
// const createProduct = async (req, res) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role) {
//         return res.status(403).json({ success: false, message: 'unauthorized access' });
//     }

//     // Proceed to add inquiry if the user has the required role
//     // Check if the user's role is 'superadmin', 'admin'
//     if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
//         return res.status(403).json({ success: false, message: 'unauthorized access' });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;

//     // Check if no file is attached to the request
//     if (!req.file) {
//       return res.status(400).json({ error: 'no file attached' });
//     }

//     const structure = req.file.path;

//     const newProduct = new Product({
//       CAS_number,
//       name_of_chemical,
//       structure,
//       molecularFormula,
//       mol_weight,
//       synonums,
//       status,
//       IUPAC_name,
//       Appearance,
//       storage
//     });

//     const savedProduct = await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: 'product saved successfully!',
//       savedProduct: savedProduct
//       // res.status(201).json({ data: savedProduct 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'internal server error' });
//   }
// };



// const createProduct = async (req, res) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     let decodedToken;
//     try {
//       decodedToken = verifyAccessToken(token);
//     } catch (error) {
//       return res.status(401).json({ success: false, message: 'unauthorized: invalid token' });
//     }

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role) {
//       return res.status(403).json({ success: false, message: 'unauthorized: No role found in token' });
//     }

//     // Proceed to add product if the user has the required role
//     if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'unauthorized: insufficient role privileges' });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;

//     // Validate status field
//     if (status !== 'active' && status !== 'inactive') {
//       return res.status(400).json({ success: false, error: 'status must be either "active" or "inactive"' });
//     }

//     // Check if no file is attached to the request
//     // let structure = ""; // Default empty structure
//     // if (req.file) {
//     //   structure = baseURL + req.file.filename; // Construct full URL for the uploaded file
//     // }

//     // const structure = baseURL + req.file.filename; // Construct full URL for the uploaded file

//     let exitsData = await Product.findOne({ CAS_number })
//     if (exitsData) {
//       return res.status(400).json({
//         success: false,
//         message: "CAS_number Data Already Exits"
//       })
//     }
//     const newProduct = new Product({
//       CAS_number,
//       name_of_chemical,
//       structure,
//       molecularFormula,
//       mol_weight,
//       synonums,
//       status,
//       IUPAC_name,
//       Appearance,
//       storage
//     });

//     const savedProduct = await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: 'product saved successfully',
//       savedProduct: {
//         ...savedProduct._doc,
//         structure: savedProduct.structure // Include full URL for the uploaded file in the response
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'internal server error' });
//   }
// };


// const createProduct = async (req, res) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     let decodedToken;
//     try {
//       decodedToken = verifyAccessToken(token);
//     } catch (error) {
//       return res.status(401).json({ success: false, message: 'unauthorized: invalid token' });
//     }

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role) {
//       return res.status(403).json({ success: false, message: 'unauthorized: No role found in token' });
//     }

//     // Proceed to add product if the user has the required role
//     if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'unauthorized: insufficient role privileges' });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;


//     let file = "";

//     const pc_id = req.body.pc_id;

//     const p_url = req.body.p_url;

//     if (p_url == "") {
//       file = req.file.filename;
//     }
//     else {
//       file = p_url ? (p_url.startsWith(baseURL) ? p_url.replace(baseURL, '') : p_url) : p_url;
//     }


//     // Validate status field
//     if (status !== 'active' && status !== 'inactive') {
//       return res.status(400).json({ success: false, error: 'status must be either "active" or "inactive"' });
//     }

//     let existsData = await Product.findOne({ CAS_number })
//     if (existsData) {
//       return res.status(400).json({
//         success: false,
//         message: "CAS_number Data Already Exists"
//       })
//     }

//     let newProductData = {
//       CAS_number,
//       name_of_chemical,
//       molecularFormula,
//       mol_weight,
//       synonums,
//       structure: file,
//       status,
//       IUPAC_name,
//       Appearance,
//       storage
//     };


//     const newProduct = new Product(newProductData);

//     const savedProduct = await newProduct.save();



//     if (pc_id != "") {
//       let updateData = await productByCompany.findByIdAndUpdate(pc_id, { $set: { status: 'active' } }, { new: true })
//     }

//     res.status(201).json({
//       success: true,
//       message: 'product saved successfully',
//       savedProduct: {
//         ...savedProduct._doc,
//         structure: newProductData.structure
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'internal server error' });
//   }
// };

const createProduct = async (req, res) => {
  try {
    
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    let decodedToken;
    try {
      decodedToken = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized: invalid token' });
    }

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'Unauthorized: No role found in token' });
    }

    // Proceed to add product if the user has the required role
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized: insufficient role privileges' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;
    const pc_id = req.body.pc_id;
    const p_url = req.body.p_url;


    // Initialize structure (this will store the file name)
    let structure = "";

    // If p_url exists and starts with the base URL, remove the base URL
    // if (p_url && p_url.startsWith(baseUrl)) {
    //   structure = p_url.replace(baseUrl, '');
    // }
    // If p_url is empty and a file is uploaded, use the uploaded file


    // Validate status field
    if (status !== 'active' && status !== 'inactive') {
      return res.status(400).json({ success: false, error: 'Status must be either "active" or "inactive"' });
    }

    // Check if CAS_number already exists
    let existsData = await Product.findOne({ CAS_number });
    if (existsData) {
      return res.status(400).json({
        success: false,
        message: "CAS_number data already exists"
      });
    }

    
    if(!req.file){
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    let uploadResult = await uploadToAzureBlob(req.file);

    const uniqueFileName = uploadResult.uniqueFileName;
   
    structure = uniqueFileName;
    

    // Prepare new product data
    let newProductData = {
      CAS_number,
      name_of_chemical,
      molecularFormula,
      mol_weight,
      synonums,
      structure,  // Use the processed file name
      status,
      IUPAC_name,
      Appearance,
      storage
    };

    // Create new product
    const newProduct = new Product(newProductData);
    const savedProduct = await newProduct.save();

    // If a product company ID exists, update the product company status to 'active'
    if (pc_id) {
      await productByCompany.findByIdAndUpdate(pc_id, { $set: { status: 'active' } }, { new: true });
    }

    res.status(201).json({
      success: true,
      message: 'Product saved successfully',
      savedProduct: {
        ...savedProduct._doc,
        structure: newProductData.structure
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


//editProductById
const editProductById = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = verifyAccessToken(token);

    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, error: 'Invalid Product ID' });
    }

    const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;


    let existData = await Product.findOne({ _id: productId });

    let updateData = {
      CAS_number,
      name_of_chemical,
      molecularFormula,
      mol_weight,
      synonums,
      status,
      IUPAC_name,
      Appearance,
      storage
    }

    if (req.file ) {


      let uploadResult = await uploadToAzureBlob(req.file);

      const uniqueFileName = uploadResult.uniqueFileName;

      const existStructure = existData?.structure;

      console.log("receiving the structure file ....");

      if (existStructure) {
        await deleteFromAzureBlob(existStructure);
      } else {
        console.log("No previous existStructure to delete");
      }

      updateData.structure = uniqueFileName;
    }

    // console.log('Update Data:', updateData); // Log updateData for debugging

    let updateProductData = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updateProductData) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product details updated successfully',
      product: updateProductData
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};






// Delete a product by ID
const deleteProductById = async (req, res) => {
  const { id } = req.params;
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
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'product deleted successfully',
      deletedProduct: deletedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};



// Display all products
const displayAllProducts = async (req, res) => {
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
    const allProducts = await Product.find();

    const updatedProducts = allProducts.map(item => {
      return {
        ...item.toObject(), // Convert the Mongoose document to a plain object
        structure: `${Azure_Storage_Base_Url}${item.structure}`
      };
    });

    res.status(200).json({
      success: true,
      message: ' all products retrieved successfully!',
      products: updatedProducts
    });
    //res.status(200).json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};


// Display details of a product using id
const displayProductDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const productDetails = await Product.findById(id);
    if (!productDetails) {
      return res.status(404).json({ error: 'product not found' });
    }
    productDetails.structure = `${Azure_Storage_Base_Url}${productDetails.structure}`
    res.status(200).json(productDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};


// const getProductInfo = async (req, res) => {
//   try {
//     const aggregationResult = await Product.aggregate([
//       {
//         $lookup: {
//           from: 'catalogs',
//           localField: 'product_id',
//           foreignField: 'product_id',
//           as: 'catalog'
//         }
//       },
//       // {
//       //   $unwind: '$catalog' // Unwind the catalog array
//       // },
//       {
//         $lookup: {
//           from: 'companies',
//           localField: 'catalog.company_id',
//           foreignField: 'company_id',
//           as: 'company_info'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           name_of_chemical: 1,
//           grade: 1,
//           CAS_number: 1,
//           structure: 1,
//           HSN_code: 1,
//           molecularFormula: 1,
//           mol_weight: 1,
//           synonums: 1,
//           applicationUses: 1,
//           remarks: 1,
//           status: 1,
//           'catalog._id': 1,
//           'catalog.coa': 1,
//           'catalog.packaging_size': 1,
//           'catalog.packaging_type': 1,
//           'catalog.storage': 1,
//           'catalog.price_min': 1,
//           'catalog.price_max': 1,
//           'catalog.qty': 1,
//           'catalog.qty_type': 1,
//           'company_info._id': 1,
//           'company_info.company_name': 1,
//           'company_info.gst': 1,
//           'company_info.contact_person_name': 1,
//           'company_info.address': 1,
//           'company_info.mobile_num': 1,
//           'company_info.emailid': 1,
//           'company_info.country': 1,
//           'company_info.state': 1,
//           'company_info.city': 1,
//           'company_info.pincode': 1,
//           'company_info.status': 1,
//           'company_info.website': 1,
//           'company_info.other_emailid': 1,
//           'company_info.other_contactno': 1,
//           'company_info.fb': 1,
//           'company_info.insta': 1,
//           'company_info.twitter': 1,
//           'company_info.linkedin': 1,
//           createdAt: 1,
//           updatedAt: 1
//         }
//       }
//     ]);

//     if (!aggregationResult || aggregationResult.length === 0) {
//       return res.status(404).json({ error: 'product not found' });
//     }

//     // Adding the message along with the response
//     return res.status(200).json({
//       success: true,
//       message: 'all products retrieved successfully!',
//       products: aggregationResult
//     });

//   } catch (error) {
//     console.error('error:', error);
//     return res.status(500).json({ error: 'internal server error' });
//   }
// }


/////////////////////////////////////////////////



const getProductInfo = async (req, res) => {
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

    const { productId } = req.params; // Extract product ID from request parameters

    // Aggregate query to fetch product details along with associated catalog and company information
    const aggregationResult = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId) // Match product ID
        }
      },
      {
        $lookup: {
          from: 'catalogs',
          localField: '_id',
          foreignField: 'product_id',
          as: 'catalog' // Populate catalog details
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'catalog.company_id',
          foreignField: '_id',
          as: 'company_info' // Populate company information
        }
      },
      {
        $project: {
          _id: 1,
          name_of_chemical: 1,
          CAS_number: 1,
          structure: 1,
          molecularFormula: 1,
          mol_weight: 1,
          synonums: 1,
          status: 1,
          IUPAC_name: 1,
          Appearance: 1,
          storage: 1,
          'catalog._id': 1,
          'catalog.company_id': 1,
          'catalog.product_id': 1,
          'catalog.category': 1,
          'catalog.subcategory': 1,
          'catalog.grade': 1,
          'catalog.COA': 1,
          'catalog.min_price': 1,
          'catalog.max_price': 1,
          'catalog.qty': 1,
          'catalog.qty_type': 1,
          'catalog.country_origin': 1,
          'catalog.supply_capacity': 1,
          'catalog.purity': 1,
          'catalog.one_lot_qty': 1,
          'catalog.one_lot_qty_type': 1,
          'catalog.one_lot_qty_price': 1,
          'catalog.max_lot_qty': 1,
          'catalog.createdAt': 1,
          'catalog.updatedAt': 1,
          'company_info._id': 1,
          'company_info.company_name': 1,
          'company_info.gst': 1,
          'company_info.contact_person_name': 1,
          'company_info.address': 1,
          'company_info.mobile_num': 1,
          'company_info.landline_num': 1,
          'company_info.emailid': 1,
          'company_info.mode_of_business': 1,
          'company_info.country': 1,
          'company_info.state': 1,
          'company_info.city': 1,
          'company_info.pincode': 1,
          'company_info.status': 1,
          'company_info.website': 1,
          'company_info.other_emailid': 1,
          'company_info.other_contactno': 1,
          'company_info.fb': 1,
          'company_info.insta': 1,
          'company_info.twitter': 1,
          'company_info.linkedin': 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    // If no matching product found, return 404 error
    if (!aggregationResult || aggregationResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }


    // Update COA and structure URLs with base URLs
    const product = aggregationResult[0];
    if (product.catalog && product.catalog.length > 0) {
      product.catalog.forEach(item => {
        if (item.COA) {
          item.COA = `${Azure_Storage_Base_Url}${item.COA}`;
        }
      });
    }

    // Update structure URLs
    if (product.structure) {
      product.structure = `${Azure_Storage_Base_Url}${product.structure}`;
    }

    // Respond with success message and product details
    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully!',
      product: aggregationResult[0] // Assuming only one product will match the ID
    });

  } catch (error) {
    // Handle any errors and return internal server error
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


// const show = (req, res, next) => {
//   let CAS_number = req.params.CAS_number;

//   Product.findOne({ CAS_number: CAS_number })
//     .then(response => {
//       if (response) {
//         res.json({
//           success: true,
//           marksheet: response
//         });
//       } else {
//         res.status(404).json({
//           success: false,
//           message: 'product not found'
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({
//         success: false,
//         message: 'an error occurred'
//       });
//     });
// };


// const show = (req, res, next) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token
//     const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role) {
//       return res.status(403).json({ success: false, message: 'Unauthorized access' });
//     }

//     // Proceed with fetching product if the user has the required role
//     // For example, check if the user's role is 'superadmin' or 'admin'
//     // Add your role-based authorization logic here
//     // For now, let's assume all authenticated users can access the product
//     // Replace this condition with your specific role-based logic if needed
//     if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Unauthorized access' });
//     }

//     let CAS_number = req.params.CAS_number;

//     Product.findOne({ CAS_number: CAS_number })
//       .then(response => {
//         if (response) {
//           res.json({
//             success: true,
//             product: response
//           });
//         } else {
//           res.status(404).json({
//             success: false,
//             message: 'Product not found'
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).json({
//           success: false,
//           message: 'An error occurred'
//         });
//       });

//   } catch (error) {
//     // Handle any unexpected errors and return a 500 internal server error
//     console.error('Error in show function:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

const show = async (req, res, next) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Proceed with fetching product if the user has the required role
    // For example, check if the user's role is 'superadmin' or 'admin'
    // Add your role-based authorization logic here
    // For now, let's assume all authenticated users can access the product
    // Replace this condition with your specific role-based logic if needed
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const CAS_number = req.params.CAS_number;
  

    // Fetch the product by CAS_number
    const product = await Product.findOne({ CAS_number: CAS_number });

    if (product) {
      // Concatenate base URL with the structure path
      const fullStructureUrl = `${Azure_Storage_Base_Url}${product.structure}`;

      // Include the full URL in the response
      res.json({
        success: true,
        product: {
          ...product.toObject(),
          structure: fullStructureUrl
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    // Handle any unexpected errors and return a 500 internal server error
    console.error('Error in show function:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Company Start here



// Define the base URL for your uploads

const createProducts = async (req, res) => {
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;

    // Validate status field
    if (status !== 'active' && status !== 'inactive') {
      return res.status(400).json({ success: false, error: 'status must be either "active" or "inactive"' });
    }

  

    let exitsData = await Product.findOne({ CAS_number })
    if (exitsData) {
      return res.status(400).json({
        success: false,
        message: "CAS_number Data Already Exits"
      })
    }

    // Check if no file is attached to the request
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'no file attached' });
    }
  
      
    let uploadResult = await uploadToAzureBlob(req.file);
  
    const uniqueFileName = uploadResult.uniqueFileName;
  
    const structure = uniqueFileName; 

    const newProduct = new Product({
      CAS_number,
      name_of_chemical,
      structure,
      molecularFormula,
      mol_weight,
      synonums,
      status,
      IUPAC_name,
      Appearance,
      storage
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'product saved successfully',
      savedProduct: {
        ...savedProduct._doc,
        structure: savedProduct.structure // Include full URL for the uploaded file in the response
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'internal server error' });
  }
};


//editProductById
const editProductsById = async (req, res) => {
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
    // if (decodedToken.companyId !== req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
    // }

    const { id } = req.params;
    const updateFields = req.body;

    // Check if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'invalid Product ID' });
    }

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    // Check if updatedProduct is null or not
    if (!updatedProduct) {
      console.log("product not found for ID:", id);
      return res.status(404).json({ success: false, error: 'product not found' });
    }

    // If product is found and updated successfully, return success response
    return res.status(200).json({
      success: true,
      message: 'product details updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    // Log and return internal server error in case of any exception
    console.error("error updating product:", error);
    return res.status(500).json({ success: false, error: 'internal server error' });
  }
};





// Delete a product by ID
const deleteProductsById = async (req, res) => {
  const { id } = req.params;
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
    // if (decodedToken.companyId !== req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
    // }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'product deleted successfully',
      deletedProduct: deletedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};



// // Display all products
// const displayAllProduct = async (req, res) => {
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

//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
//     const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided
//     const skip = (page - 1) * limit;

//     // Extract filter parameter
//     const filter = req.query.filter;
//     const matchStage = {};

//     if (filter) {
//       matchStage.$or = [
//         { name_of_chemical: { $regex: filter, $options: 'i' } }, // Case-insensitive partial match
//         { CAS_number: { $regex: filter, $options: 'i' } }        // Case-insensitive partial match
//       ];
//     }

//     const allProducts = await Product.aggregate([
//       {
//         $match: matchStage
//       },
//       {
//         $lookup: {
//           from: 'catalogs',
//           localField: '_id',
//           foreignField: 'product_id',
//           as: 'catalog'
//         }
//       },
//       // {
//       //   $match: {
//       //     'catalog.status': 'active'
//       //   }
//       // },
//       {
//         $addFields: {
//           min_price: { $min: "$catalog.min_price" },
//           max_price: { $max: "$catalog.max_price" }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           name_of_chemical: 1,
//           CAS_number: 1,
//           structure: 1,
//           molecularFormula: 1,
//           mol_weight: 1,
//           synonums: 1,
//           status: 1,
//           IUPAC_name: 1,
//           Appearance: 1,
//           storage: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           catalog: {
//             min_price: 1,
//             max_price: 1
//           }
//         }
//       },
//       {
//         $skip: skip
//       },
//       {
//         $limit: limit
//       }
//     ]);

//     if (!allProducts || allProducts.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: "Product Not available",
//         data: []
//       });
//     }

//     const updatedProducts = allProducts.map(product => {
//       return {
//         ...product,
//         structure: `${baseURL}${product.structure}`
//       };
//     });

//     const totalProducts = await Product.countDocuments(matchStage);
//     const totalPages = Math.ceil(totalProducts / limit);

//     res.status(200).json({
//       success: true,
//       message: 'All products retrieved successfully!',
//       data: {
//         product: updatedProducts,
//         page: page,
//         limit: limit,
//         totalPages: totalPages,
//         totalCount: totalProducts
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const displayAllProduct = async (req, res) => {
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

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided
    const skip = (page - 1) * limit;

    // Extract filter parameter
    const filter = req.query.filter;
    const matchStage = {};

    if (filter) {
      matchStage.$or = [
        { name_of_chemical: { $regex: filter, $options: 'i' } }, // Case-insensitive partial match
        { CAS_number: { $regex: filter, $options: 'i' } }        // Case-insensitive partial match
      ];
    }

    const allProducts = await Product.aggregate([
      {
        $match: matchStage
      },
      {
        $lookup: {
          from: 'catalogs',
          localField: '_id',
          foreignField: 'product_id',
          as: 'catalog'
        }
      },
      {
        $addFields: {
          min_price: { $min: "$catalog.min_price" },
          max_price: { $max: "$catalog.max_price" }
        }
      },
      {
        $project: {
          _id: 1,
          name_of_chemical: 1,
          CAS_number: 1,
          structure: 1,
          molecularFormula: 1,
          mol_weight: 1,
          synonums: 1,
          status: 1,
          IUPAC_name: 1,
          Appearance: 1,
          storage: 1,
          min_price: 1,
          max_price: 1,
          verified:1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Product Not available",
        data: []
      });
    }

    const updatedProducts = allProducts.map(product => ({
      ...product,
      structure: `${Azure_Storage_Base_Url}${product.structure ? product.structure : "no_image.png"}`,
      catalog: [
        {
          min_price: product.min_price ,
          max_price: product.max_price
        }
      ]
    }));

    const totalProducts = await Product.countDocuments(matchStage);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      message: 'All products retrieved successfully!',
      data: {
        product: updatedProducts,
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalCount: totalProducts
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const displayAllProductWithoutToken = async (req, res) => {
  try {

    const allProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'catalogs',
          localField: '_id', // Corrected localField
          foreignField: 'product_id',
          as: 'catalog' // Populate catalog details
        }
      },
      // {
      //   $match: {
      //     'catalog.status': 'active'
      //   }
      // },
      {
        $project: {
          _id: 1,
          name_of_chemical: 1,
          CAS_number: 1,
          structure: 1,
          molecularFormula: 1,
          mol_weight: 1,
          synonums: 1,
          status: 1,
          IUPAC_name: 1,
          Appearance: 1,
          storage: 1,
          createdAt: 1,
          updatedAt: 1,
          catalog: {
            min_price: 1,
            max_price: 1
          }
        }
      }
    ]);

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Product Not available",
        data: []
      });
    }

    const updatedProducts = allProducts.map(product => {
      return {
        ...product,
        structure: `${Azure_Storage_Base_Url}${product.structure}`
      };
    });

    res.status(200).json({
      success: true,
      message: 'All products retrieved successfully!',
      products: updatedProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


const displayAllProductByLoginPage = async (req, res) => {
  try {

    const allProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'catalogs',
          localField: '_id', // Corrected localField
          foreignField: 'product_id',
          as: 'catalog' // Populate catalog details
        }
      },
      // {
      //   $match: {
      //     'catalog.status': 'active'
      //   }
      // },
      {
        $project: {
          _id: 1,
          name_of_chemical: 1,
          CAS_number: 1,
          structure: 1,
          molecularFormula: 1,
          mol_weight: 1,
          synonums: 1,
          status: 1,
          IUPAC_name: 1,
          Appearance: 1,
          storage: 1,
          createdAt: 1,
          updatedAt: 1,
          catalog: {
            min_price: 1,
            max_price: 1
          }
        }
      },
      {
        $limit: 12
      }
    ]);

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Product Not available",
        data: []
      });
    }

    const updatedProducts = allProducts.map(product => {
      return {
        ...product,
        structure: `${Azure_Storage_Base_Url}${product.structure}`
      };
    });

    res.status(200).json({
      success: true,
      message: 'All products retrieved successfully!',
      products: updatedProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



// Display details of a product using id
const displayProductDetailById = async (req, res) => {
  const { id } = req.params;
  try {
    const productDetails = await Product.findById(id);
    if (!productDetails) {
      return res.status(404).json({ error: 'product not found' });
    }
    res.status(200).json(productDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};


const getProductInfos = async (req, res) => {
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

    const productId = req.params.productId; // Extract product ID from request parameters

    // Aggregate query to fetch product details along with associated catalog and company information
    const aggregationResult = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId) // Match product ID
        }
      },
      {
        $lookup: {
          from: 'catalogs',
          localField: 'product_id',
          foreignField: 'product_id',
          as: 'catalog' // Populate catalog details
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'catalog.company_id',
          foreignField: 'company_id',
          as: 'company_info' // Populate company information
        }
      },
      {
        $match: {
          'company_info._id': new mongoose.Types.ObjectId(decodedToken.companyId) // Match company ID from decoded token
        }
      },
      {
        $project: {
          _id: 1,
          name_of_chemical: 1,
          CAS_number: 1,
          structure: 1,
          molecularFormula: 1,
          mol_weight: 1,
          synonums: 1,
          status: 1,
          IUPAC_name: 1,
          Appearance: 1,
          storage: 1,
          'catalog._id': 1,
          'catalog.company_id': 1,
          'catalog.product_id': 1,
          'catalog.category': 1,
          'catalog.subcategory': 1,
          'catalog.grade': 1,
          'catalog.COA': 1,
          'catalog.min_price': 1,
          'catalog.max_price': 1,
          'catalog.qty': 1,
          'catalog.qty_type': 1,
          'catalog.country_origin': 1,
          'catalog.supply_capacity': 1,
          'catalog.purity': 1,
          'catalog.one_lot_qty': 1,
          'catalog.one_lot_qty_type': 1,
          'catalog.one_lot_qty_price': 1,
          'catalog.max_lot_qty': 1,
          'catalog.createdAt': 1,
          'catalog.updatedAt': 1,
          'company_info._id': 1,
          'company_info.company_name': 1,
          'company_info.gst': 1,
          'company_info.contact_person_name': 1,
          'company_info.address': 1,
          'company_info.mobile_num': 1,
          'company_info.landline_num': 1,
          'company_info.emailid': 1,
          'company_info.mode_of_business': 1,
          'company_info.country': 1,
          'company_info.state': 1,
          'company_info.city': 1,
          'company_info.pincode': 1,
          'company_info.status': 1,
          'company_info.website': 1,
          'company_info.other_emailid': 1,
          'company_info.other_contactno': 1,
          'company_info.fb': 1,
          'company_info.insta': 1,
          'company_info.twitter': 1,
          'company_info.linkedin': 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    // If no matching product found, return 404 error
    if (!aggregationResult || aggregationResult.length === 0) {
      return res.status(200).json({ message: 'Product Not available', data: [] });
    }


    // Update COA and structure URLs with base URLs
    const product = aggregationResult[0];
    if (product.catalog && product.catalog.length > 0) {
      product.catalog.forEach(item => {
        if (item.COA) {
          item.COA = `${Azure_Storage_Base_Url}${item.COA}`;
        }
      });
    }

    // Update structure URLs
    if (product.structure) {
      product.structure = `${Azure_Storage_Base_Url}${product.structure}`;
    }

    // Respond with success message and product details
    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully!',
      product: aggregationResult[0] // Assuming only one product will match the ID
    });

  } catch (error) {
    // Handle any errors and return internal server error
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


// const productDetailsById = async (req, res) => {
//   try {
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

//     const productId = req.query.productId;
//     // console.log(productId);

//     const displayData = await Product.aggregate([
//       {
//         $match: { _id: new mongoose.Types.ObjectId(productId) }
//       },
//       {
//         $lookup: {
//           from: 'catalogs',
//           localField: '_id', // Corrected localField
//           foreignField: 'product_id',
//           as: 'catalog' // Populate catalog details
//         }
//       },
//       {
//         $unwind: '$catalog' // Unwind catalog array
//       },
//       {
//         $lookup: {
//           from: 'companies',
//           localField: 'catalog.company_id',
//           foreignField: '_id',
//           as: 'company_info' // Populate company information
//         }
//       },
//       {
//         $unwind: '$company_info' // Unwind company_info array
//       },
//       {
//         $lookup: {
//           from: 'companyotherinfos',
//           localField: 'company_info._id',
//           foreignField: 'company_id',
//           as: 'company_otherInfo' // Populate company other information
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           name_of_chemical: 1,
//           CAS_number: 1,
//           structure: 1,
//           molecularFormula: 1,
//           mol_weight: 1,
//           synonums: 1,
//           status: 1,
//           IUPAC_name: 1,
//           Appearance: 1,
//           storage: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           'catalog._id': 1,
//           'catalog.company_id': 1,
//           'catalog.product_id': 1,
//           'catalog.category': 1,
//           'catalog.subcategory': 1,
//           'catalog.grade': 1,
//           'catalog.COA': 1,
//           'catalog.min_price': 1,
//           'catalog.max_price': 1,
//           'catalog.qty': 1,
//           'catalog.qty_type': 1,
//           'catalog.active_chemicals': 1,
//           'catalog.status': 1,
//           'catalog.country_origin': 1,
//           'catalog.supply_capacity': 1,
//           'catalog.purity': 1,
//           'catalog.one_lot_qty': 1,
//           'catalog.one_lot_qty_type': 1,
//           'catalog.one_lot_qty_price': 1,
//           'catalog.max_lot_qty': 1,
//           'catalog.createdAt': 1,
//           'catalog.updatedAt': 1,
//           'company_info.company_name': 1,
//           'company_info.gst': 1,
//           'company_info.contact_person_name': 1,
//           'company_info.address': 1,
//           'company_info.mobile_num': 1,
//           'company_info.landline_num': 1,
//           'company_info.emailid': 1,
//           'company_info.mode_of_business': 1,
//           'company_info.country': 1,
//           'company_info.state': 1,
//           'company_info.city': 1,
//           'company_info.pincode': 1,
//           'company_info.status': 1,
//           'company_info.website': 1,
//           'company_info.other_emailid': 1,
//           'company_info.other_contactno': 1,
//           'company_info.fb': 1,
//           'company_info.insta': 1,
//           'company_info.twitter': 1,
//           'company_info.linkedin': 1,
//           'company_otherInfo.logo': 1

//         }
//       }
//     ]);


//     if (!displayData || displayData.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: "Product Not available",
//         data: []
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product Details Found Successfully",
//       data: displayData
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }


const productDetailsById = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Token ko "Bearer <token>" format se extract karein

    // Token ko verify karein
    const decodedToken = verifyAccessToken(token); // Aassumed verifyAccessToken ek function hai jo token ko verify karta hai

    // Dekhiye ki kya decoded token mein avashyak jaankari upalabdh hai ya nahin
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Dekhiye ki kya upayogakarta ka kirdaar 'company' hai
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const productId = req.query.productId;

    const displayData = await Product.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(productId) }
      },
      {


        $lookup: {
          from: 'catalogs',
          localField: '_id',
          foreignField: 'product_id',
          as: 'catalog' // Catalog ke vivaran ko sammlit karein
        }
      },
      {
        $unwind: {
          path: '$catalog',
          preserveNullAndEmptyArrays: true // Agar katalog null ho ya khaali ho to bhi preserve karein
        }
      },
      // {
      //   $match: {
      //     'catalog.active_chemicals': 'active'
      //   }
      // },
      // {
      {
        $lookup: {
          from: 'companies',
          localField: 'catalog.company_id',
          foreignField: '_id',
          as: 'company_info' // Company ki jaankari ko sammlit karein
        }
      },
      {
        $unwind: {
          path: '$company_info',
          preserveNullAndEmptyArrays: true // Agar company_info null ho ya khaali ho to bhi preserve karein
        }
      },
      {
        $lookup: {
          from: 'companyotherinfos',
          localField: 'company_info._id',
          foreignField: 'company_id',
          as: 'company_otherInfo' // Company ke anya vivaran ko sammlit karein
        }
      },
      {
        $unwind: {
          path: '$company_otherInfo',
          preserveNullAndEmptyArrays: true // Agar company_info null ho ya khaali ho to bhi preserve karein
        }
      },
      {
        $lookup: {
          from: 'documents',
          localField: 'company_info._id',
          foreignField: 'company_id',
          as: 'document_details' // Company ke anya vivaran ko sammlit karein
        }
      },
      {
        $project: {
          // _id: 1,
          // name_of_chemical: 1,
          // CAS_number: 1,
          // structure: 1,
          // molecularFormula: 1,
          // mol_weight: 1,
          // synonums: 1,
          // status: 1,
          // IUPAC_name: 1,
          // Appearance: 1,
          // storage: 1,
          // createdAt: 1,
          // updatedAt: 1,
          product: {
            _id: '$_id',
            name_of_chemical: '$name_of_chemical',
            CAS_number: '$CAS_number',
            structure: '$structure',
            molecularFormula: '$molecularFormula',
            mol_weight: '$mol_weight',
            synonums: '$synonums',
            status: '$status',
            IUPAC_name: '$IUPAC_name',
            Appearance: '$Appearance',
            storage: '$storage',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt'
          },
          company_otherInfo: { $ifNull: ['$company_otherInfo', []] },
          // company_info: { $ifNull: ['$company_info', []] },
          document_details: { $ifNull: ['$document_details', []] },
          catalog: {
            $cond: {
              if: { $eq: ["$catalog.active_chemicals", "active"] },
              then: "$catalog",
              else: null
            }
          },
          'company_info.company_name': 1,
          'company_info.gst': 1,
          'company_info.contact_person_name': 1,
          'company_info.address': 1,
          'company_info.mobile_num': 1,
          'company_info.landline_num': 1,
          'company_info.emailid': 1,
          'company_info.mode_of_business': 1,
          'company_info.country': 1,
          'company_info.state': 1,
          'company_info.city': 1,
          'company_info.pincode': 1,
          'company_info.status': 1,
          'company_info.website': 1,
          'company_info.other_emailid': 1,
          'company_info.other_contactno': 1,
          'company_info.fb': 1,
          'company_info.insta': 1,
          'company_info.twitter': 1,
          'company_info.linkedin': 1,
        }
      }
    ]);

    if (!displayData || displayData.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Product Not available",
        data: []
      });
    }


   

    // Update URLs with base URLs
    displayData.forEach(item => {
      if (item.product && item.product.structure) {
        item.product.structure = Azure_Storage_Base_Url + item.product.structure;
      }

      // Update document_details URLs
      if (Array.isArray(item.document_details)) {
        item.document_details.forEach(doc => {
          if (doc.doc_file) {
            doc.doc_file = Azure_Storage_Base_Url + doc.doc_file.trim();
          }
        });
      }

      // Update COA in catalog if exists
      if (item.catalog && item.catalog.COA) {
        item.catalog.COA = Azure_Storage_Base_Url + item.catalog.COA.trim();
      }

      if (item.company_otherInfo && item.company_otherInfo.logo) {
        item.company_otherInfo.logo = Azure_Storage_Base_Url + item.company_otherInfo.logo.trim();
      }

    });

    res.status(200).json({
      success: true,
      message: "Product Details Found Successfully",
      data: displayData
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


const editCompanyProduct = async(req, res) =>{
  try {

    console.log("running this function when admin chenge the product .")

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = verifyAccessToken(token);

    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, error: 'Invalid Product ID' });
    }

    const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;

    // checking data is exist in productByCompany
    let existData = await productByCompany.findOne({ _id: productId });

    if(!existData){
      return res.status(404).json({ success: false, message: 'Product Not Found' });
    }

    let existProduct = await Product.findOne({ company_productId: existData._id });

    let updateData = {
      CAS_number,
      name_of_chemical,
      molecularFormula,
      mol_weight,
      synonums,
      status,
      IUPAC_name,
      Appearance,
      storage,
      verified:true
    }

    if (req.file ) {


      let uploadResult = await uploadToAzureBlob(req.file);

      const uniqueFileName = uploadResult.uniqueFileName;

      const existStructure = existData?.structure;

      console.log("receiving the structure file ....");

      if (existStructure) {
        await deleteFromAzureBlob(existStructure);
      } else {
        console.log("No previous existStructure to delete");
      }

      updateData.structure = uniqueFileName;
    }

    

    // updating productByCompany 
    let updateProductByCompanyData = await productByCompany.findByIdAndUpdate(productId, {$set: updateData}, { new: true });

    // now edit product

    if(!existProduct){
      let newProduct = new Product({
        ...updateData,
        company_id:existData.company_id,
        company_productId:productId,
      })

      await newProduct.save();
    }else{
      await Product.findByIdAndUpdate(existProduct._id, {$set: updateData}, { new: true });
    }

    

    return res.status(200).json({
      success: true,
      message: 'Product details updated successfully',
      product: updateProductByCompanyData
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}




module.exports = {
  createProduct: [verifyToken, createProduct],
  editProductById: [verifyToken, editProductById],
  deleteProductById: [verifyToken, deleteProductById],
  displayAllProducts: [verifyToken, displayAllProducts],
  displayProductDetailsById,
  getProductInfo: [verifyToken, getProductInfo],
  show: [verifyToken, show],


  //Company Start here
  createProducts: [verifyToken, createProducts],
  editProductsById: [verifyToken, editProductsById],
  deleteProductsById: [verifyToken, deleteProductsById],
  displayAllProduct: [verifyToken, displayAllProduct],
  getProductInfos: [verifyToken, getProductInfos],
  productDetailsById: [verifyToken, productDetailsById],
  displayAllProductWithoutToken,
  displayAllProductByLoginPage,


  verifyAccessToken, // Added JWT verification middleware
  editCompanyProduct

};

