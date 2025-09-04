// Import required modules
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const Inquiry = require('../models/inquiry'); // Import Inquiry model
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const mongoose = require('mongoose');
const Catalog = require('../models/catelog');
const Company = require('../models/company');



// // Define addInquiry function
// const addInquiry = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const companyToken = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify company token
//         const decodedToken = jwt.verify(companyToken, process.env.ACCESS_TOKEN_SECRET); // Verify token using the company's secret key

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Proceed to add inquiry if the user has the required role (optional)
//         // Example logic: Check if the user associated with the token is authorized to perform this action
//         // You can customize this check based on your specific requirements
//         // For example, check if the user's role is 'company' or 'admin'
//         // If not, you can return a 403 Forbidden error

//         // Extract inquiry data from request body
//         const { inquiry_company_id, catalog_id, inquiry_qty, tentative_dispatch_date, inq_qty_type } = req.body;

//         // Check if the inquiry's company ID matches the company ID from the token
//         if (inquiry_company_id !== decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Create a new Inquiry instance
//         const newInquiry = new Inquiry({
//             inquiry_company_id,
//             catalog_id,
//             inquiry_qty,
//             tentative_dispatch_date,
//             inq_qty_type
//         });

//         // Save the new inquiry to the database
//         await newInquiry.save();

//         // Send success response
//         return res.status(201).json({
//             success: true,
//             message: 'inquiry added successfully',
//             inquiry: newInquiry,
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return an appropriate response
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'server error', error: error.message });
//     }
// };


const addInquiry = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(decodedToken.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Extract inquiry data from request body
        const { buyer_company_id, seller_company_id, inquiry_qty, qty_type, inq_type, product_id, status, category, subcategory, grade, COA, min_price, max_price, country_origin, supply_capacity, purity, one_lot_qty, one_lot_qty_type, one_lot_qty_price } = req.body;

        // Create a new Inquiry instance
        const newInquiry = new Inquiry({
            buyer_company_id,
            seller_company_id,
            inquiry_qty,
            qty_type,
            inq_type,
            product_id,
            status,
            category,
            subcategory,
            grade,
            COA,
            min_price,
            max_price,
            country_origin,
            supply_capacity,
            purity,
            one_lot_qty,
            one_lot_qty_type,
            one_lot_qty_price,
            payment_type,
            total_lot,
            payment_terms,
            delivery_time
        });

        // Save the new inquiry to the database
        await newInquiry.save();

        // Send success response
        return res.status(201).json({
            success: true,
            message: 'Inquiry added successfully',
            inquiry: newInquiry,
        });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



////////////////////////////////////////////////////////////////////////
const displayBuyingInquiryDetail = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let buyingInquiries;

        // If the user is a company, fetch buying inquiries associated with the company
        if (tokenData.role === 'company') {
            buyingInquiries = await Inquiry.find({ buyer_company_id: tokenData.companyId });
        } else {
            // For superadmins and admins, fetch all buying inquiries
            buyingInquiries = await Inquiry.find();
        }

        // Extract inquiry ID from request parameters
        const { id } = req.params;

        // Retrieve the specific buying inquiry associated with the provided ID
        const buyingInquiry = await Inquiry.findOne({ _id: id, buyer_company_id: tokenData.companyId });

        // If the inquiry is not found, return a 404 error
        if (!buyingInquiry) {
            return res.status(200).json({ success: false, message: 'Buying inquiry not available' });
        }

        // Send success response with the details of the specific buying inquiry
        return res.status(200).json({
            success: true,
            message: 'Buying inquiry details retrieved successfully',
            buyingInquiry
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




/////////////////////

const displaySellingInquiryDetails = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let sellingInquiries;

        // If the user is a company, fetch selling inquiries associated with the company
        if (tokenData.role === 'company') {
            sellingInquiries = await Inquiry.find({ seller_company_id: tokenData.companyId });
        } else {
            // For superadmins and admins, fetch all selling inquiries
            sellingInquiries = await Inquiry.find();
        }

        // Extract inquiry ID from request parameters
        const { id } = req.params;

        // Retrieve the specific selling inquiry associated with the provided ID
        const sellingInquiry = await Inquiry.findOne({ _id: id, seller_company_id: tokenData.companyId });

        // If the inquiry is not found, return a 404 error
        if (!sellingInquiry) {
            return res.status(200).json({ success: false, message: 'Selling inquiry available' });
        }

        // Send success response with the details of the specific selling inquiry
        return res.status(200).json({
            success: true,
            message: 'Selling inquiry details retrieved successfully',
            sellingInquiry
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



////////////////////////////////
const displayProductWithCompanyInfo = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let inquiries;

        // If the user is a company, fetch inquiries associated with the company
        if (tokenData.role === 'company') {
            inquiries = await Inquiry.find({ $or: [{ buyer_company_id: tokenData.companyId }, { seller_company_id: tokenData.companyId }] });
        } else {
            // For superadmins and admins, fetch all inquiries
            inquiries = await Inquiry.find();
        }

        // Use aggregation to join product details with company information
        const inquiriesWithProductAndCompany = await Inquiry.aggregate([
            {
                $lookup: {
                    from: 'catalogs',
                    localField: 'catalog_id',
                    foreignField: '_id',
                    as: 'catalog'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company'
                }
            },
            {
                $project: {
                    'catalog.packaging_size': 1,
                    'catalog.packaging_type': 1,
                    'catalog.storage': 1,
                    'catalog.price_min': 1,
                    'catalog.price_max': 1,
                    'catalog.qty': 1,
                    'catalog.qty_type': 1,
                    'catalog.createdAt': 1,
                    'catalog.updatedAt': 1,
                    'product_details.CAS_number': 1,
                    'product_details.name_of_chemical': 1,
                    'product_details.structure': 1,
                    'product_details.molecularFormula': 1,
                    'product_details.mol_weight': 1,
                    'product_details.synonums': 1,
                    'product_details.status': 1,
                    'product_details.IUPAC_name': 1,
                    'product_details.Appearance': 1,
                    'product_details.storage': 1,
                    'buyer_company.company_name': 1,
                    'buyer_company.gst': 1,
                    'buyer_company.contact_person_name': 1,
                    'buyer_company.address': 1,
                    'buyer_company.mobile_num': 1,
                    'buyer_company.landline_num': 1,
                    'buyer_company.emailid': 1,
                    'buyer_company.mode_of_business': 1,
                    'buyer_company.country': 1,
                    'buyer_company.state': 1,
                    'buyer_company.city': 1,
                    'buyer_company.pincode': 1,
                    'buyer_company.status': 1,
                    'seller_company.company_name': 1,
                    'seller_company.gst': 1,
                    'seller_company.contact_person_name': 1,
                    'seller_company.address': 1,
                    'seller_company.mobile_num': 1,
                    'seller_company.landline_num': 1,
                    'seller_company.emailid': 1,
                    'seller_company.mode_of_business': 1,
                    'seller_company.country': 1,
                    'seller_company.state': 1,
                    'seller_company.city': 1,
                    'seller_company.pincode': 1,
                    'seller_company.status': 1,
                    inquiry_qty: 1,
                    tentative_dispatch_date: 1,
                    inq_type: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        // Send success response with the inquiry details including product and company information
        return res.status(200).json({
            success: true,
            message: 'Inquiry details retrieved successfully',
            inquiries: inquiriesWithProductAndCompany,
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



////////////////////////////////////////
const displayProductWithCompanyInfoById = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Extract inquiry ID from request parameters
        const { id } = req.params;

        // Find the inquiry by ID
        const inquiry = await Inquiry.findById(id);

        // If inquiry not found, return a 404 error
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        // Use aggregation to join product details with company information
        const inquiryWithProduct = await Inquiry.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) } // Match the inquiry by its ID

            },
            {
                $lookup: {
                    from: 'catalogs',
                    localField: 'catalog_id',
                    foreignField: '_id',
                    as: 'catalog'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company'
                }
            },
            {
                $project: {
                    'catalog.packaging_size': 1,
                    'catalog.packaging_type': 1,
                    'catalog.storage': 1,
                    'catalog.price_min': 1,
                    'catalog.price_max': 1,
                    'catalog.qty': 1,
                    'catalog.qty_type': 1,
                    'product_details.CAS_number': 1,
                    'product_details.name_of_chemical': 1,
                    'product_details.structure': 1,
                    'product_details.molecularFormula': 1,
                    'product_details.mol_weight': 1,
                    'product_details.synonums': 1,
                    'product_details.status': 1,
                    'product_details.IUPAC_name': 1,
                    'product_details.Appearance': 1,
                    'product_details.storage': 1,
                    'buyer_company.company_name': 1,
                    'buyer_company.gst': 1,
                    'buyer_company.contact_person_name': 1,
                    'buyer_company.address': 1,
                    'buyer_company.mobile_num': 1,
                    'buyer_company.landline_num': 1,
                    'buyer_company.emailid': 1,
                    'buyer_company.mode_of_business': 1,
                    'buyer_company.country': 1,
                    'buyer_company.state': 1,
                    'buyer_company.city': 1,
                    'buyer_company.pincode': 1,
                    'buyer_company.status': 1,
                    'seller_company.company_name': 1,
                    'seller_company.gst': 1,
                    'seller_company.contact_person_name': 1,
                    'seller_company.address': 1,
                    'seller_company.mobile_num': 1,
                    'seller_company.landline_num': 1,
                    'seller_company.emailid': 1,
                    'seller_company.mode_of_business': 1,
                    'seller_company.country': 1,
                    'seller_company.state': 1,
                    'seller_company.city': 1,
                    'seller_company.pincode': 1,
                    'seller_company.status': 1,
                    inquiry_qty: 1,
                    tentative_dispatch_date: 1,
                    inq_qty_type: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        // Send success response with the inquiry details including product and company information
        return res.status(200).json({
            success: true,
            message: 'Inquiry details retrieved successfully',
            inquiry: inquiryWithProduct,
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// this much done ok

///////////////////////////////////////
// Controller function to display all buying inquiries
const buy = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let buyingInquiries;

        // If the user is a company, fetch buying inquiries associated with the company
        if (tokenData.role === 'company') {
            buyingInquiries = await Inquiry.find({ inquiry_company_id: tokenData.companyId, inq_qty_type: "buying" });
        } else {
            // For superadmins and admins, fetch all buying inquiries
            buyingInquiries = await Inquiry.find({ inq_qty_type: "buying" });
        }

        // If no buying inquiries are found, return a 404 error
        if (buyingInquiries.length === 0) {
            return res.status(404).json({ success: false, message: 'No buying inquiries found' });
        }

        let inquiryWithProduct;

        // Use aggregation to join product details with company information
        inquiryWithProduct = await Inquiry.aggregate([
            {
                $match: { _id: { $in: buyingInquiries.map(inquiry => inquiry._id) } }
            },
            {
                $lookup: {
                    from: 'catalogs',
                    localField: 'catalog_id',
                    foreignField: '_id',
                    as: 'catalog'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'inquiry_company_id',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            {
                $project: {
                    'catalog.packaging_size': 1,
                    'catalog.packaging_type': 1,
                    'catalog.storage': 1,
                    'catalog.price_min': 1,
                    'catalog.price_max': 1,
                    'catalog.qty': 1,
                    'catalog.qty_type': 1,
                    'catalog.createdAt': 1,
                    'catalog.updatedAt': 1,
                    'product_details.CAS_number': 1,
                    'product_details.name_of_chemical': 1,
                    'product_details.structure': 1,
                    'product_details.molecularFormula': 1,
                    'product_details.mol_weight': 1,
                    'product_details.synonums': 1,
                    'product_details.status': 1,
                    'product_details.IUPAC_name': 1,
                    'product_details.Appearance': 1,
                    'product_details.storage': 1,
                    'company.company_name': 1,
                    'company.gst': 1,
                    'company.contact_person_name': 1,
                    'company.address': 1,
                    'company.mobile_num': 1,
                    'company.landline_num': 1,
                    'company.emailid': 1,
                    'company.mode_of_business': 1,
                    'company.country': 1,
                    'company.state': 1,
                    'company.city': 1,
                    'company.pincode': 1,
                    'company.status': 1,
                    inquiry_qty: 1,
                    tentative_dispatch_date: 1,
                    inq_qty_type: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        // If no buying inquiries are found, return a 404 error
        if (inquiryWithProduct.length === 0) {
            return res.status(200).json({ success: false, message: 'No buying inquiries available' });
        }

        // Send success response with the list of all buying inquiries
        return res.status(200).json({
            success: true,
            message: 'All buying inquiries retrieved successfully',
            buyingInquiries: inquiryWithProduct // Modified to include the aggregated data
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error('Error retrieving buying inquiries:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




////////////////////////////////
// Controller function to display all selling inquiries
const selling = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let sellingInquiries;

        // If the user is a company, fetch selling inquiries associated with the company
        if (tokenData.role === 'company') {
            sellingInquiries = await Inquiry.find({ inquiry_company_id: tokenData.companyId, inq_qty_type: "selling" });
        } else {
            // For superadmins and admins, fetch all selling inquiries
            sellingInquiries = await Inquiry.find({ inq_qty_type: "selling" });
        }

        // If no selling inquiries are found, return a 404 error
        if (sellingInquiries.length === 0) {
            return res.status(404).json({ success: false, message: 'No selling inquiries found' });
        }

        let inquiryWithProduct;

        // Use aggregation to join product details with company information
        inquiryWithProduct = await Inquiry.aggregate([
            {
                $match: { _id: { $in: sellingInquiries.map(inquiry => inquiry._id) } }
            },
            {
                $lookup: {
                    from: 'catalogs',
                    localField: 'catalog_id',
                    foreignField: '_id',
                    as: 'catalog'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'inquiry_company_id',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            {
                $project: {
                    'catalog.packaging_size': 1,
                    'catalog.packaging_type': 1,
                    'catalog.storage': 1,
                    'catalog.price_min': 1,
                    'catalog.price_max': 1,
                    'catalog.qty': 1,
                    'catalog.qty_type': 1,
                    'catalog.createdAt': 1,
                    'catalog.updatedAt': 1,
                    'product_details.CAS_number': 1,
                    'product_details.name_of_chemical': 1,
                    'product_details.structure': 1,
                    'product_details.molecularFormula': 1,
                    'product_details.mol_weight': 1,
                    'product_details.synonums': 1,
                    'product_details.status': 1,
                    'product_details.IUPAC_name': 1,
                    'product_details.Appearance': 1,
                    'product_details.storage': 1,
                    'company.company_name': 1,
                    'company.gst': 1,
                    'company.contact_person_name': 1,
                    'company.address': 1,
                    'company.mobile_num': 1,
                    'company.landline_num': 1,
                    'company.emailid': 1,
                    'company.mode_of_business': 1,
                    'company.country': 1,
                    'company.state': 1,
                    'company.city': 1,
                    'company.pincode': 1,
                    'company.status': 1,
                    inquiry_qty: 1,
                    tentative_dispatch_date: 1,
                    inq_qty_type: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        // If no selling inquiries are found, return a 404 error
        if (inquiryWithProduct.length === 0) {
            return res.status(200).json({ success: false, message: 'No selling inquiries available' });
        }

        // Send success response with the list of all selling inquiries
        return res.status(200).json({
            success: true,
            message: 'All selling inquiries retrieved successfully',
            sellingInquiries: inquiryWithProduct // Modified to include the aggregated data
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error('Error retrieving selling inquiries:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


///////////////////////////////////




















// Started here

////////////
// const displayAllBuyingInquirieslist = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Proceed to add inquiry if the user has the required role
//         // Check if the user's role is 'superadmin', 'admin', or 'company'
//         if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Retrieve all buying inquiries associated with the company
//         const buyingInquiries = await Inquiry.find({ inquiry_company_id: decodedToken.companyId, inq_qty_type: "buying" });

//         // If no buying inquiries are found, return a 404 error
//         if (buyingInquiries.length === 0) {
//             return res.status(404).json({ success: false, message: 'no buying inquiries found' });
//         }

//         // Send success response with the list of all buying inquiries
//         return res.status(200).json({
//             success: true,
//             message: 'all buying inquiries retrieved successfully',
//             buyingInquiries
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'server error', error: error.message });
//     }
// };

const displayAllBuyingInquirieslist = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let buyingInquiries;

        // If the user is a company, fetch buying inquiries associated with the company
        if (tokenData.role === 'company') {
            buyingInquiries = await Inquiry.find({ inquiry_company_id: tokenData.companyId, inq_qty_type: "buying" });
        } else {
            // For superadmins and admins, fetch all buying inquiries
            buyingInquiries = await Inquiry.find({ inq_qty_type: "buying" });
        }

        // If no buying inquiries are found, return a 404 error
        if (buyingInquiries.length === 0) {
            return res.status(200).json({ success: false, message: 'No buying inquiries available' });
        }

        // Send success response with the list of all buying inquiries
        return res.status(200).json({
            success: true,
            message: 'All buying inquiries retrieved successfully',
            buyingInquiries
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error('Error retrieving buying inquiries:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




/////////////////////
// Define the displayBuyingInquiryDetails function
const displayBuyingInquiryDetails = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let buyingInquiries;

        // If the user is a company, fetch buying inquiries associated with the company
        if (tokenData.role === 'company') {
            buyingInquiries = await Inquiry.find({ inquiry_company_id: tokenData.companyId, inq_qty_type: "buying" });
        } else {
            // For superadmins and admins, fetch all buying inquiries
            buyingInquiries = await Inquiry.find({ inq_qty_type: "buying" });
        }

        // Extract inquiry ID from request parameters
        const { id } = req.params;

        // Retrieve the specific buying inquiry associated with the provided ID
        const buyingInquiry = await Inquiry.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },

            {
                $lookup: {
                    from: 'catalogs',
                    localField: 'catalog_id',
                    foreignField: '_id',
                    as: 'catalog'
                }
            },
            {
                $unwind: '$catalog'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            {
                $unwind: '$product_details'
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'inquiry_company_id',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $project: {
                    'product_details._id': 1,
                    'catalog.packaging_size': 1,
                    'catalog.packaging_type': 1,
                    'catalog.storage': 1,
                    'catalog.price_min': 1,
                    'catalog.price_max': 1,
                    'catalog.qty': 1,
                    'catalog.qty_type': 1,
                    'catalog.createdAt': 1,
                    'catalog.updatedAt': 1,
                    'company.company_name': 1,
                    'company.gst': 1,
                    'company.contact_person_name': 1,
                    'company.address': 1,
                    'company.mobile_num': 1,
                    'company.landline_num': 1,
                    'company.emailid': 1,
                    'company.mode_of_business': 1,
                    'company.country': 1,
                    'product_details.CAS_number': 1,
                    'product_details.name_of_chemical': 1,
                    'product_details.structure': 1,
                    'product_details.molecularFormula': 1,
                    'product_details.mol_weight': 1,
                    'product_details.synonums': 1,
                    'product_details.status': 1,
                    'product_details.IUPAC_name': 1,
                    'product_details.Appearance': 1,
                    'product_details.storage': 1,
                    'company._id': 1,
                    'company.state': 1,
                    'company.city': 1,
                    'company.pincode': 1,
                    'company.status': 1,
                    'inq_qty_type': 1,
                    'createdAt': 1,
                    'updatedAt': 1,
                }
            }
        ]);

        // If the inquiry is not found, return a 404 error
        if (!buyingInquiry || buyingInquiry.length === 0) {
            return res.status(200).json({ success: false, message: 'buying inquiry not available' });
        }

        // Check if the retrieved inquiry has inq_qty_type as "buying"
        if (buyingInquiry[0].inq_qty_type !== "buying") {
            return res.status(200).json({ success: false, message: 'the inquiry is not of type "buying"' });
        }

        // Send success response with the details of the specific buying inquiry
        return res.status(200).json({
            success: true,
            message: 'buying inquiry details retrieved successfully',
            buyingInquiry: buyingInquiry[0]
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



/////////



//////////////////////////////
const displayAllSellingInquiriesList = async (req, res, next) => {
    try {
        // Verify JWT token using the middleware
        verifyToken(req, res, () => { });

        // Extract decoded token from the request object
        const tokenData = req.user;

        // Check if the decoded token contains necessary information for verification
        if (!tokenData || !tokenData.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Proceed to display inquiries if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let sellingInquiries;

        // If the user is a company, fetch selling inquiries associated with the company
        if (tokenData.role === 'company') {
            sellingInquiries = await Inquiry.find({ inquiry_company_id: tokenData.companyId, inq_qty_type: "selling" });
        } else {
            // For superadmins and admins, fetch all selling inquiries
            sellingInquiries = await Inquiry.find({ inq_qty_type: "selling" });
        }

        // If no selling inquiries are found, return a 404 error
        if (sellingInquiries.length === 0) {
            return res.status(200).json({ success: false, message: 'No selling inquiries available' });
        }

        // Send success response with the list of all selling inquiries
        return res.status(200).json({
            success: true,
            message: 'All selling inquiries retrieved successfully',
            sellingInquiries
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};





// ////////////////////////////////////
// const displayAll = async (req, res, next) => {
//     try {
//         // Verify JWT token using the middleware
//         verifyToken(req, res, () => { });

//         // Extract decoded token from the request object
//         const tokenData = req.user;

//         // Check if the decoded token contains necessary information for verification
//         if (!tokenData || !tokenData.role) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Proceed to display inquiries if the user has the required role
//         // Check if the user's role is 'superadmin', 'admin', or 'company'
//         if (!['superadmin', 'admin', 'company'].includes(tokenData.role)) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         let buyingInquiriesResult;

//         // If the user is a company, aggregate to fetch buying inquiries associated with the company
//         if (tokenData.role === 'company') {
//             // Create a new ObjectId instance for company ID
//             const company = new mongoose.Types.ObjectId(tokenData.companyId);
//             // Aggregate to retrieve all buying inquiries along with associated company, catalog, and product
//             buyingInquiriesResult = await Inquiry.aggregate([
//                 // Match buying inquiries for the company
//                 { $match: { inquiry_company_id: company, inq_qty_type: 'buying' } },
//                 // Lookup to get company information
//                 { $lookup: { from: 'companies', localField: 'inquiry_company_id', foreignField: '_id', as: 'company' } },
//                 // Unwind company array
//                 { $unwind: '$company' },
//                 // Lookup to get catalog information
//                 { $lookup: { from: 'catalogs', localField: 'inquiry_catalog_id', foreignField: '_id', as: 'catalog' } },
//                 // Unwind catalog array
//                 { $unwind: '$catalog' },
//                 // Lookup to get product information
//                 { $lookup: { from: 'products', localField: 'inquiry_product_id', foreignField: '_id', as: 'product' } },
//                 // Unwind product array
//                 { $unwind: '$product' },
//                 // Project to shape the output
//                 {
//                     $project: {
//                         _id: 1,
//                         inquiry_name: 1,
//                         inquiry_description: 1,
//                         company: '$company',
//                         catalog: '$catalog',
//                         product: '$product'
//                     }
//                 }
//             ]);
//         } else {
//             // For superadmins and admins, aggregate to fetch all buying inquiries
//             buyingInquiriesResult = await Inquiry.aggregate([
//                 // Match all buying inquiries
//                 { $match: { inq_qty_type: 'buying' } },
//                 // Lookup to get company information
//                 { $lookup: { from: 'companies', localField: 'inquiry_company_id', foreignField: '_id', as: 'company' } },
//                 // Unwind company array
//                 { $unwind: '$company' },
//                 // Lookup to get catalog information
//                 { $lookup: { from: 'catalogs', localField: 'inquiry_catalog_id', foreignField: '_id', as: 'catalog' } },
//                 // Unwind catalog array
//                 { $unwind: '$catalog' },
//                 // Lookup to get product information
//                 { $lookup: { from: 'products', localField: 'inquiry_product_id', foreignField: '_id', as: 'product' } },
//                 // Unwind product array
//                 { $unwind: '$product' },
//                 // Project to shape the output
//                 {
//                     $project: {
//                         _id: 1,
//                         inquiry_name: 1,
//                         inquiry_description: 1,
//                         company: '$company',
//                         catalog: '$catalog',
//                         product: '$product'
//                     }
//                 }
//             ]);
//         }

//         // If no buying inquiries are found, return a 404 error
//         if (buyingInquiriesResult.length === 0) {
//             return res.status(404).json({ success: false, message: 'No buying inquiries found' });
//         }

//         // Send success response with the list of all buying inquiries
//         return res.status(200).json({
//             success: true,
//             message: 'All buying inquiries retrieved successfully',
//             buyingInquiries: buyingInquiriesResult
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error('Error retrieving buying inquiries:', error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

///////////////////


module.exports = {
    addInquiry: [verifyToken, addInquiry], // Use token verification middleware before executing addInquiry function
    displayBuyingInquiryDetail: [verifyToken, displayBuyingInquiryDetail], // Use token verification middleware before executing displaySellingInquiryList function
    displayProductWithCompanyInfo: [verifyToken, displayProductWithCompanyInfo], // Use token verification middleware before executing displayProductWithCompanyInfo function
    displayProductWithCompanyInfoById: [verifyToken, displayProductWithCompanyInfoById], // Use token verification middleware before executing displayProductWithCompanyInfo function
    displaySellingInquiryDetails: [verifyToken, displaySellingInquiryDetails], // Use token verification middleware before executing displayBuyingInquiries function
    buy: [verifyToken, buy], // Use token verification middleware before executing displayBuyingInquiries function
    selling: [verifyToken, selling], // Use token verification middleware before executing displayBuyingInquiries function


    displayAllBuyingInquirieslist: [verifyToken, displayAllBuyingInquirieslist], // Use token verification middleware before executing displaySpecificSellingInquiryDetails function
    displayBuyingInquiryDetails: [verifyToken, displayBuyingInquiryDetails], // Use token verification middleware before executing displaySellingInquiryList function

    displayAllSellingInquiriesList: [verifyToken, displayAllSellingInquiriesList], // Use token verification middleware before executing displayBuyingInquiryDetails function
    // displayAll: [verifyToken, displayAll], // Use token verification middleware before executing displayBuyingInquiries function
    verifyAccessToken
};






// Import required modules
// const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
// const Inquiry = require('../models/inquiry'); // Import Inquiry model
// const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
// const mongoose = require('mongoose');
// const Catalog = require('../models/catelog');
// const Company = require('../models/company');



// // 
// const addInquiry = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Proceed to add inquiry if the user has the required role
//         // Check if the user's role is 'superadmin', 'admin', or 'company'
//         if (!['superadmin', 'admin', 'company'].includes(decodedToken.role)) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Extract inquiry data from request body
//         const { buyer_company_id, seller_company_id, inquiry_qty, qty_type, inq_qty_type, product_id, status, category, subcategory, grade, COA, min_price, max_price, country_origin, supply_capacity, purity, one_lot_qty, one_lot_qty_type, one_lot_qty_price } = req.body;

//         // Create a new Inquiry instance
//         const newInquiry = new Inquiry({
//             buyer_company_id,
//             seller_company_id,
//             inquiry_qty,
//             qty_type,
//             inq_qty_type,
//             product_id,
//             status,
//             category,
//             subcategory,
//             grade,
//             COA,
//             min_price,
//             max_price,
//             country_origin,
//             supply_capacity,
//             purity,
//             one_lot_qty,
//             one_lot_qty_type,
//             one_lot_qty_price
//         });

//         // Save the new inquiry to the database
//         await newInquiry.save();

//         // Send success response
//         return res.status(201).json({
//             success: true,
//             message: 'Inquiry added successfully',
//             inquiry: newInquiry,
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return an appropriate response
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };



