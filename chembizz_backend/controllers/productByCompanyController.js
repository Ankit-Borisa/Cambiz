const mongoose = require("mongoose");
const productByCompany = require('../models/productByCompany');
const Product = require('../models/productModel');
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl")

const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");


const companyAdd = async (req, res) => {
    try {

        const token = req.headers.authorization.split(" ")[1]; 
      
        const decodedToken = verifyAccessToken(token); 
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



        const { CAS_number, name_of_chemical, molecularFormula, mol_weight, synonums, status, IUPAC_name, Appearance, storage } = req.body;


        // checking , is there is another product available with same CAS number.

        let existProduct = await Product.findOne({ CAS_number: CAS_number });

        if(existProduct){
            return res.status(400).json({ success: false, message: 'Product with this CAS number already exists' });
        }

        let structure="";
        if (req.file) {
            let uploadResult = await uploadToAzureBlob(req.file);
            const uniqueFileName = uploadResult.uniqueFileName;
            structure = uniqueFileName;
        }


        // check cas number is already available or not.
        // now first we have to make a document for product by company.
        // then make a document for product. where we add keys verified:false, company_id,company_productId,


        // adding product in product by company.
        const newProductByCompany = new productByCompany({
            company_id: decodedToken.companyId,
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

        const savedProductByCompany = await newProductByCompany.save();

        let ProductByCompanyId= savedProductByCompany._id.toString();

        // making product document . 

        const newProduct = new Product({
            company_id: decodedToken.companyId,
            CAS_number,
            name_of_chemical,
            structure,
            molecularFormula,
            mol_weight,
            synonums,
            status,
            IUPAC_name,
            Appearance,
            storage,
            company_productId:ProductByCompanyId,
            verified:false
        });

        await newProduct.save();

        res.status(200).json({
            success: true,
            message: 'product saved successfully',
            savedProduct: {
                ...savedProductByCompany._doc,
                structure: savedProductByCompany.structure // Include full URL for the uploaded file in the response
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'internal server error' });
    }
};


const displayList = async (req, res) => {
    try {
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

        let allDisplayList = await productByCompany.aggregate([
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company_id',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            }
        ]);

        allDisplayList.forEach(product => {
            if (product.structure) {
                product.structure = Azure_Storage_Base_Url + product.structure;
            }
        });

        res.status(200).json({
            success: true,
            message: "Product By Company Display Successfully",
            data: allDisplayList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'internal server error' });
    }
}

const displayDetails = async (req, res) => {
    try {
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
        let { id } = req.params

        let displayDetails = await productByCompany.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company_id',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            }
        ]);

        displayDetails.forEach(product => {
            if (product.structure) {
                product.structure = Azure_Storage_Base_Url + product.structure;
            }
        });

        res.status(200).json({
            success: true,
            message: "Product By Company Display Successfully",
            data: displayDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'internal server error' });
    }
}

const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = verifyAccessToken(token);

        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }


        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        const deletedProduct = await productByCompany.findByIdAndDelete(id);
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

module.exports = {
    companyAdd: [verifyToken, companyAdd],
    displayList: [verifyToken, displayList],
    displayDetails: [verifyToken, displayDetails],
    deleteProductById: [verifyToken, deleteProductById],
    verifyAccessToken
}