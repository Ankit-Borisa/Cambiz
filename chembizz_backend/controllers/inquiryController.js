// Import required modules
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const Inquiry = require('../models/inquiry'); // Import Inquiry model
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const mongoose = require('mongoose');
const { getReceiverSocketId, io } = require("../socket/socket");
const Catalog = require('../models/catelog');
const Company = require('../models/company');
const Product = require("../models/productModel")
const inquiry_status = require('../models/inquiry_status');
const Notification = require('../models/notification');

const {Azure_Storage_Base_Url} = require("../utils/blobUrl")


// Define addInquiry function
const addInquiry = async (req, res, next) => {
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

        // Extract inquiry data from request body
        const {
            seller_company_id,
            inquiry_qty,
            qty_type,
            inq_type, // Added inq_type
            product_id,
            status,
            hsn_code,
            category,
            subcategory,
            grade,
            min_price,
            max_price,
            country_origin,
            supply_capacity,
            purity,
            inco_terms,
            one_lot_qty,
            one_lot_qty_type,
            one_lot_qty_price,
            payment_status,
            payment_type,
            total_lot,
            COA,
            payment_terms,
            delivery_time
        } = req.body;

        // Validate inq_type
        if (!['commercial', 'sample inquiry'].includes(inq_type)) {
            return res.status(400).json({ success: false, message: 'Invalid inquiry type' });
        }
        if (inq_type === 'commercial') {
            if (!inquiry_qty || !qty_type || !min_price || !max_price || !payment_terms || !delivery_time || !inco_terms) {
                return res.status(400).json({ success: false, message: 'Missing required fields for commercial inquiry' });
            }
        } else if (inq_type === 'sample inquiry') {
            if (!one_lot_qty || !one_lot_qty_type || !one_lot_qty_price || !total_lot || !payment_status || !payment_type) {
                return res.status(400).json({ success: false, message: 'Missing required fields for sample inquiry' });
            }
        }

        if (min_price < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid Quantity"
            })
        }

        // Define inquiry data
        const newInquiryData = {
            buyer_company_id: decodedToken.companyId,
            seller_company_id,
            inquiry_qty,
            qty_type,
            inq_type, // Added inq_type
            product_id,
            status,
            category,
            subcategory,
            grade,
            hsn_code,
            COA,
            min_price,
            inco_terms,
            max_price,
            country_origin,
            supply_capacity,
            purity,
            one_lot_qty,
            one_lot_qty_type,
            one_lot_qty_price,
            payment_status,
            payment_type,
            total_lot,
            payment_terms,
            delivery_time
        };

        // Create the new Inquiry instance
        const newInquiry = new Inquiry(newInquiryData);

        // Save the new inquiry to the database
        await newInquiry.save();

        const receiverSocketId1 = getReceiverSocketId(seller_company_id);

        if (receiverSocketId1) {
            io.to(receiverSocketId1).emit('newInquiry', newInquiry)
        }

        let productName = await Product.findOne({ _id: product_id });

        let product_name = productName.name_of_chemical

        const notificationData = await Notification.create({
            title: "Inquiry For Product",
            company_id: seller_company_id,
            inquiry_id: newInquiry._id,
            message: `You Receive a New Inquiry For ${product_name}`,

        })

        const sellerSocketId = getReceiverSocketId(seller_company_id); // Implement this function to get the seller's socket ID
        if (sellerSocketId) {
            io.to(sellerSocketId).emit('newNotification', notificationData);
        }

        const inquiryStatusData = {
            inquiry_id: newInquiry._id,
            inquiry_status_value: [
                {
                    status: "Inquiry",
                    dateAndTime: new Date()
                }
            ],
        };

        const newInquiryStatus = new inquiry_status(inquiryStatusData);

        // Save the inquiry status to the database
        await newInquiryStatus.save();
        // Send success response
        return res.status(200).json({
            success: true,
            message: 'inquiry added successfully',
            inquiry: newInquiry,
        });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};


const displayBuyingInquiryList = async (req, res, next) => {
    try {
        // Verify if the user has the role of superadmin or admin
        const decodedToken = verifyAccessToken(req.headers.authorization.split(" ")[1]);
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is superadmin or admin
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Perform aggregation to fetch all buying inquiries with inq_type 'inquiry'
        const buyingInquiryList = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: 'commercial'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 1,
                    buyer_company_id: 1,
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    hsn_code: 1,
                    grade: 1,
                    COA: 1,
                    inco_terms: 1,
                    min_price: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if the filtered buying inquiry list is empty
        if (!buyingInquiryList || buyingInquiryList.length === 0) {
            return res.status(200).json({ success: false, message: 'No buying inquiries found with inq_type "inquiry"' });
        }

       

        const updatedBuyingInquiryList = buyingInquiryList.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the filtered buying inquiry list in the response
        return res.status(200).json({ success: true, message: 'Buying inquiry list retrieved successfully', updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error('Error retrieving buying inquiries:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const displayBuyingInquiryDetailsById = async (req, res, next) => {
    try {
        // Verify if the user has the role of superadmin or admin
        const decodedToken = verifyAccessToken(req.headers.authorization.split(" ")[1]);
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is superadmin or admin
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
        const { id } = req.params;

        // Perform aggregation to fetch buying inquiry details by ID and inq_type 'inquiry'
        const buyingInquiryDetails = await Inquiry.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    inq_type: 'commercial'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $lookup: {
                    from: 'negotations',
                    localField: 'inquiryId',
                    foreignField: 'inquiry_id',
                    as: 'negotiations'
                }
            },
            {
                $addFields: {
                    latestNegotiation: { $last: '$negotiations' }
                }
            },
            {
                $project: {
                    _id: 0,
                    inquiry_id: '$_id',
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    COA: 1,
                    hsn_code: 1,
                    inco_terms: 1,
                    min_price: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'latestNegotiation.payment_terms': 1,
                    'latestNegotiation.delivery_time': 1,
                    'latestNegotiation.request_status': 1,
                    'latestNegotiation.status_change_by': 1,
                }
            }
        ]);

        // Check if the buying inquiry details are found
        if (!buyingInquiryDetails || buyingInquiryDetails.length === 0) {
            return res.status(200).json({ success: false, message: 'buying inquiry details not available' });
        }

        

        const updatedBuyingInquiryList = buyingInquiryDetails.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the buying inquiry details in the response
        return res.status(200).json({ success: true, message: 'buying inquiry details retrieved successfully', updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



//

const displayBuyingInquirySampleDetails = async (req, res, next) => {
    try {
        // Perform aggregation to fetch buying inquiries with inq_type as 'sample inquiry'
        const buyingInquirySampleDetails = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: 'sample inquiry'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 1,
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    COA: 1,
                    hsn_code: 1,
                    inco_terms: 1,
                    min_price: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if any sample inquiries are found
        if (!buyingInquirySampleDetails || buyingInquirySampleDetails.length === 0) {
            return res.status(200).json({ success: false, message: 'no sample inquiries available' });
        }

        

        const updatedBuyingInquiryList = buyingInquirySampleDetails.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the sample inquiry details in the response
        return res.status(200).json({ success: true, message: 'sample inquiry details retrieved successfully', updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



//
const displaySellingInquiryList = async (req, res, next) => {
    try {
        // Perform aggregation to fetch selling inquiries with inq_type 'inquiry'
        const sellingInquiryList = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: 'commercial'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 1,
                    buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    hsn_code: 1,
                    subcategory: 1,
                    grade: 1,
                    COA: 1,
                    min_price: 1,
                    inco_terms: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if the filtered selling inquiry list is empty
        if (!sellingInquiryList || sellingInquiryList.length === 0) {
            return res.status(200).json({ success: false, message: 'no selling inquiries found with inq_type "inquiry"' });
        }

      

        const updatedBuyingInquiryList = sellingInquiryList.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the filtered selling inquiry list in the response
        return res.status(200).json({ success: true, message: 'filtered selling inquiry list retrieved successfully', updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



//

const displaySellingInquiryDetailsById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Perform aggregation to fetch selling inquiry details by ID and inq_type 'inquiry'
        const sellingInquiryDetails = await Inquiry.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    inq_type: 'commercial'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 0,
                    inquiry_id: '$_id',
                    buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    hsn_code: 1,
                    COA: 1,
                    min_price: 1,
                    max_price: 1,
                    inco_terms: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    purity: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if the selling inquiry details are found
        if (!sellingInquiryDetails || sellingInquiryDetails.length === 0) {
            return res.status(200).json({ success: false, message: 'selling inquiry details not available' });
        }

      
        const updatedBuyingInquiryList = sellingInquiryDetails.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the selling inquiry details in the response
        return res.status(200).json({ success: true, message: 'selling inquiry details retrieved successfully', updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



const displaySellingInquirySampleDetails = async (req, res, next) => {
    try {
        // Perform aggregation to fetch selling inquiries with inq_type 'sample inquiry'
        const sellingInquirySampleDetails = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: 'sample inquiry'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 0,
                    inquiry_id: '$_id',
                    buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    COA: 1,
                    min_price: 1,
                    hsn_code: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    purity: 1,
                    inco_term: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if the selling inquiry sample details are found
        if (!sellingInquirySampleDetails || sellingInquirySampleDetails.length === 0) {
            return res.status(200).json({ success: false, message: 'no selling inquiry sample details available' });
        }

    

        const updatedBuyingInquiryList = sellingInquirySampleDetails.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the selling inquiry sample details in the response
        return res.status(200).json({ success: true, message: 'selling inquiry sample details retrieved successfully', updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



// const displayAllInquiries = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         let inquiryList;

//         // Define aggregation pipeline stages based on user's role
//         const pipeline = [];

//         // Match stage to filter inquiries based on role
//         if (['superadmin', 'admin'].includes(decodedToken.role)) {
//             // For superadmins and admins, fetch all inquiries
//             pipeline.push({ $match: {} });
//         } else if (decodedToken.role === 'company') {
//             // For companies, fetch inquiries belonging to the authenticated company
//             pipeline.push({ $match: { buyer_company_id: new mongoose.Types.ObjectId(decodedToken.company_id) } });
//         } else {
//             // Role not recognized
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Lookup stages to populate seller company and product details
//         pipeline.push(
//             {
//                 $lookup: {
//                     from: 'companies',
//                     localField: 'seller_company_id',
//                     foreignField: '_id',
//                     as: 'seller_company'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'product_id',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             }
//         );

//         // Projection stage to shape the output
//         pipeline.push(
//             {
//                 $project: {
//                     _id: 0,
//                     inquiry_id: '$_id',
//                     seller_company: { $arrayElemAt: ['$seller_company', 0] },
//                     product: { $arrayElemAt: ['$product', 0] },
//                     inquiry_qty: 1,
//                     qty_type: 1,
//                     inq_type: 1,
//                     status: 1,
//                     category: 1,
//                     subcategory: 1,
//                     grade: 1,
//                     COA: 1,
//                     min_price: 1,
//                     max_price: 1,
//                     country_origin: 1,
//                     supply_capacity: 1,
//                     purity: 1,
//                     purity: 1,
//                     inco_terms: 1,
//                     one_lot_qty: 1,
//                     one_lot_qty_type: 1,
//                     one_lot_qty_price: 1,
//                     payment_status: 1,
//                     payment_type: 1,
//                     total_lot: 1,
//                     payment_terms: 1,
//                     delivery_time: 1,
//                     createdAt: 1,
//                     updatedAt: 1
//                 }
//             }
//         );

//         // Execute aggregation pipeline
//         inquiryList = await Inquiry.aggregate(pipeline);

//         // Check if the inquiry list is empty
//         if (!inquiryList || inquiryList.length === 0) {
//             return res.status(200).json({ success: false, message: 'no inquiries available' });
//         }



//         const updatedBuyingInquiryList = inquiryList.map(item => {
//             if (item.COA) {
//                 item.COA = `${baseURL}${item.COA}`;
//             }
//             if (item.product && item.product.structure) {
//                 item.product.structure = `${baseUrlStructure}${item.product.structure}`;
//             }
//             return item;
//         });

//         // Send the inquiry list in the response
//         return res.status(200).json({ success: true, message: 'inquiry list retrieved successfully', updatedBuyingInquiryList });
//     } catch (error) {
//         // Handle any unexpected errors and return an appropriate response
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'server error', error: error.message });
//     }
// };


const displayAllInquiries = async (req, res) => {
    try {
        const decodedToken = verifyAccessToken(req.headers.authorization.split(" ")[1]);
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is superadmin or admin
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let displayAllInquiry = await Inquiry.aggregate([
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'salesinvoices',
                    localField: '_id',
                    foreignField: 'inquiry_id',
                    as: 'po_details'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 0,
                    inquiry_id: '$_id',
                    buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    po_details: 1,
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    hsn_code: 1,
                    COA: 1,
                    min_price: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    purity: 1,
                    inco_term: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!displayAllInquiry || displayAllInquiry.length === 0) {
            return res.status(404).json({ success: false, message: 'no selling inquiry and buyer details available' });
        }


        for (let inquiry of displayAllInquiry) {
            for (let poDetail of inquiry.po_details) {
                if (poDetail.upload_COA) {
                    poDetail.upload_COA = `${Azure_Storage_Base_Url}${poDetail.upload_COA}`;
                }
                if (poDetail.upload_po) {
                    poDetail.upload_po = `${Azure_Storage_Base_Url}${poDetail.upload_po}`;
                }
            }
        }
        const updatedBuyingInquiryList = displayAllInquiry.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        res.status(200).json({
            success: true,
            message: "All Inquiry Display Successfully",
            data: updatedBuyingInquiryList
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}

const updateInquiryStatus = async (req, res) => {
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


        let inquiryId = req.params.inquiryId
        if (!inquiryId) {
            return res.status(401).json({
                success: false,
                message: "Inquiry Not Found!"
            })
        }
        let updateData = {
            status: req.body.status
        }
        let inquiryUpdateData = await Inquiry.findByIdAndUpdate(inquiryId, updateData, { new: true })

        const buyer_company_name = await Company.findOne({ _id: inquiryUpdateData.buyer_company_id })
        const seller_company_name = await Company.findOne({ _id: inquiryUpdateData.seller_company_id })
        const product_name = await Company.findOne({ _id: inquiryUpdateData.product_id })

        // let notificationRecipientId;
        let sellerNotificationMessage = `${buyer_company_name.company_name} change ${req.body.status} on inquiry of ${product_name.name_of_chemical}`;
        let buyerNotificationMessage = `${seller_company_name.company_name} change ${req.body.status} on inquiry of ${product_name.name_of_chemical}`;

        // Determine the recipient of the notification
        if (decodedToken.companyId == inquiryUpdateData.buyer_company_id) {

            const notificationData = await Notification.create({
                title: "Inquiry Status Change",
                company_id: inquiryUpdateData.seller_company_id,
                inquiry_id: inquiryId,
                message: buyerNotificationMessage,
            });

            const buyerSocketId = getReceiverSocketId(inquiryUpdateData.seller_company_id); // Implement this function to get the seller's socket ID
            if (buyerSocketId) {
                io.to(buyerSocketId).emit('newNotification', notificationData);
            }



        } else if (decodedToken.companyId == inquiryUpdateData.seller_company_id) {

            const notificationData = await Notification.create({
                title: "Inquiry Status Change",
                company_id: inquiryUpdateData.buyer_company_id,
                inquiry_id: inquiryId,
                message: sellerNotificationMessage,
            });

            const sellerSocketId = getReceiverSocketId(inquiryUpdateData.buyer_company_id); // Implement this function to get the seller's socket ID
            if (sellerSocketId) {
                io.to(sellerSocketId).emit('newNotification', notificationData);
            }



        } else {
            // Token companyId does not match buyer or seller companyId
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        res.status(200).json({
            success: true,
            message: "Inquiry Status Update Successfully",
            data: inquiryUpdateData
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}

const inquiryStatusChange = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ success: false, message: 'Authorization header missing' });
        }

        const token = authorizationHeader.split(" ")[1]; // Extract token from "Bearer <token>" format

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

        const inquiryId = req.params.inquiryId;
        if (!inquiryId) {
            return res.status(404).json({ success: false, message: "Inquiry Not Found!" });
        }

        const userCompanyId = decodedToken.companyId;



        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry Not Found!" });
        }

        const currentStatus = inquiry.status;
        const sellerId = inquiry.seller_company_id;
        const buyerId = inquiry.buyer_company_id;
        const product = inquiry.product_id
        const buyer_company_name = await Company.findOne({ _id: buyerId })
        const seller_company_name = await Company.findOne({ _id: sellerId })
        const product_name = await Product.findOne({ _id: product })

        let status = req.body.status;



        io.to(getReceiverSocketId(buyerId)).emit('statusChanged', {
            inquiryId,
            status,
        });

        io.to(getReceiverSocketId(sellerId)).emit('statusChanged', {
            inquiryId,
            status,
        });


        if (currentStatus === 'pending') {
            if (sellerId == userCompanyId && (status === 'approved' || status === 'rejected')) {
                inquiry.status = status;
                await inquiry.save();

                if (status === 'approved' && inquiry.inq_type === 'sample inquiry') {
                    inquiry.status = 'deal done';
                    await inquiry.save();


                    if (status === "approved" && inquiry.inq_type === "sample inquiry") {
                        status = "deal done"

                    }

                    io.to(getReceiverSocketId(buyerId)).emit('statusChanged', {
                        inquiryId,
                        status,
                    });

                    io.to(getReceiverSocketId(sellerId)).emit('statusChanged', {
                        inquiryId,
                        status,
                    });

                    let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Deal' }] } }, { new: true });

                    const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                    if (inquiryStatusSocket) {
                        io.to(inquiryStatusSocket).emit('statusChange', updateData);
                    }

                    const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                    if (inquiryStatusSocket1) {
                        io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                    }
                }


                const notificationData = await Notification.create({
                    title: `Inquiry Status ${status}`,
                    company_id: buyerId,
                    inquiry_id: inquiryId,
                    message: `${seller_company_name.company_name} change status to ${status} on inquiry of ${product_name.name_of_chemical}`,
                });

                const buyerSocketId = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }


                if (status === "rejected" && (inquiry.inq_type === "commercial" || inquiry.inq_type === "sample inquiry")) {
                    let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Rejected' }] } }, { new: true });

                    const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                    if (inquiryStatusSocket) {
                        io.to(inquiryStatusSocket).emit('statusChange', updateData);
                    }

                    const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                    if (inquiryStatusSocket1) {
                        io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                    }
                }

                return res.status(200).json({ success: true, message: "Seller changed status successfully" });
            } else if (buyerId == userCompanyId && status === 'cancel') {
                inquiry.status = status;
                await inquiry.save();
                const notificationData = await Notification.create({
                    title: `Inquiry Status ${status}`,
                    company_id: sellerId,
                    inquiry_id: inquiryId,
                    message: `${buyer_company_name.company_name} change status to ${status} on inquiry of ${product_name.name_of_chemical}`,
                });

                const buyerSocketId = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Cancel' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }

                return res.status(200).json({ success: true, message: "Buyer changed status successfully" });
            } else {
                return res.status(400).json({ success: false, message: "Invalid status change request" });
            }
        } else if (currentStatus === 'approved') {
            if (buyerId == userCompanyId && status === 'cancel') {
                inquiry.status = status;
                await inquiry.save();
                const notificationData = await Notification.create({
                    title: `Inquiry Status ${status}`,
                    company_id: sellerId,
                    inquiry_id: inquiryId,
                    message: `${buyer_company_name.company_name} change status to ${status} on inquiry of ${product_name.name_of_chemical}`,
                });

                const buyerSocketId = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }

                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Cancel' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }

                return res.status(200).json({ success: true, message: "Status changed to cancel successfully" });
            } else if (sellerId == userCompanyId && status === 'rejected') {
                inquiry.status = status;
                await inquiry.save();
                const notificationData = await Notification.create({
                    title: `Inquiry Status ${status}`,
                    company_id: buyerId,
                    inquiry_id: inquiryId,
                    message: `${seller_company_name.company_name} change status to ${status} on inquiry of ${product_name.name_of_chemical}`,
                });

                const buyerSocketId = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Rejected' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }

                return res.status(200).json({ success: true, message: "Status changed to rejected successfully" });
            } else {
                return res.status(400).json({ success: false, message: "Invalid status change request" });
            }
        } else if (currentStatus === 'negotiation') {
            if (sellerId == userCompanyId && status === 'rejected') {
                inquiry.status = status;
                await inquiry.save();

                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Rejected' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }

            } else if (buyerId == userCompanyId && status === 'cancel') {
                inquiry.status = status;
                await inquiry.save();

                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Cancel' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }
            }

        } else if (currentStatus === 'invoice') {
            if (sellerId == userCompanyId && status === 'dispatch') {
                inquiry.status = status;
                await inquiry.save();

                const notificationData = await Notification.create({
                    title: `Order Status`,
                    company_id: buyerId,
                    inquiry_id: inquiryId,
                    message: `${product_name.name_of_chemical} ${status}`,
                });

                const buyerSocketId = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Dispatch' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }

                return res.status(200).json({ success: true, message: "Status changed to dispatch successfully" });
            }
        } else if (currentStatus === 'dispatch') {
            if (sellerId == userCompanyId && status === 'in transit') {
                inquiry.status = status;
                await inquiry.save();
                const notificationData = await Notification.create({
                    title: `Order Status`,
                    company_id: buyerId,
                    inquiry_id: inquiryId,
                    message: `${product_name.name_of_chemical} ${status}`,
                });

                const buyerSocketId = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'In Transit' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }


                return res.status(200).json({ success: true, message: "Status changed to in transit successfully" });
            }
        } else if (currentStatus === 'in transit') {
            if (buyerId == userCompanyId && status === 'delivered') {
                inquiry.status = status;
                await inquiry.save();

                const notificationData = await Notification.create({
                    title: `${product_name.name_of_chemical} ${status}`,
                    company_id: sellerId,
                    inquiry_id: inquiryId,
                    message: `${product_name.name_of_chemical} ${status} To ${buyer_company_name.company_name} `,
                });

                const buyerSocketId = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Delivered' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(buyerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                const inquiryStatusSocket1 = getReceiverSocketId(sellerId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }


                return res.status(200).json({ success: true, message: "Status changed to delivered successfully" });
            }
        } else if (currentStatus === 'rejected') {
            return res.status(200).json({ success: true, message: "No further changes allowed on a rejected inquiry" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid current status" });
        }



    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const displayBuyerInquiryList = async (req, res, next) => {
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

        // Perform aggregation to fetch buying inquiries with the specified company ID
        const buyerInquiryList = await Inquiry.aggregate([
            {
                $match: {
                    buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 1,
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    COA: 1,
                    hsn_code: 1,
                    min_price: 1,
                    inco_terms: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if the filtered buying inquiry list is empty
        if (!buyerInquiryList || buyerInquiryList.length === 0) {
            return res.status(200).json({ success: false, message: 'No buyer inquiries found for the given company ID' });
        }


        const updatedBuyingInquiryList = buyerInquiryList.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseUrl}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // Send the filtered buying inquiry list in the response
        return res.status(200).json({ success: true, message: 'Filtered buyer inquiry list retrieved successfully', buyerInquiryList: updatedBuyingInquiryList });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


const displayBuyercpmpanyAndSallercompany = async (req, res) => {
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

        let token_type = req.params.token_type

        if (token_type === 'buyer') {

            // const buyerCompanyInquiries = await Inquiry.find({ buyer_company_id: decodedToken.companyId })
            const buyerCompanyInquiries = await Inquiry.aggregate([
                {
                    $match: {
                        buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'seller_company_id',
                        foreignField: '_id',
                        as: 'seller_company',
                        pipeline: [
                            {
                                $project: {
                                    password: 0 // Exclude the password field
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'companyotherinfos',
                        localField: 'seller_company_id',
                        foreignField: 'company_id',
                        as: 'other_info'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product_id',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $lookup: {
                        from: 'inquiry_statuses',
                        localField: '_id',
                        foreignField: 'inquiry_id',
                        as: 'inquiry_status'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        seller_company: { $arrayElemAt: ['$seller_company', 0] },
                        other_info: { $arrayElemAt: ['$other_info.logo', 0] },
                        product: { $arrayElemAt: ['$product', 0] },
                        inquiry_status: 1,
                        inquiry_qty: 1,
                        qty_type: 1,
                        inq_type: 1,
                        status: 1,
                        category: 1,
                        subcategory: 1,
                        grade: 1,
                        COA: 1,
                        min_price: 1,
                        inco_terms: 1,
                        max_price: 1,
                        country_origin: 1,
                        supply_capacity: 1,
                        purity: 1,
                        hsn_code: 1,
                        one_lot_qty: 1,
                        one_lot_qty_type: 1,
                        one_lot_qty_price: 1,
                        payment_status: 1,
                        payment_type: 1,
                        total_lot: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);

            
            const updatedBuyingInquiryList = buyerCompanyInquiries.map(item => {
                // if (item.COA) {
                //     item.COA = `${baseURL}${item.COA}`;
                // }
                if (item.product && item.product.structure) {
                    item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
                }
                return item;
            });

            res.status(200).json({
                success: true,
                message: "BuyerCompany Details succussfully",
                data: updatedBuyingInquiryList
            })
        } else if (token_type === 'seller') {
            // const buyerCompanyInquiries = await Inquiry.find({ saller_company_id: decodedToken.companyId })
            const buyerCompanyInquiries = await Inquiry.aggregate([
                {
                    $match: {
                        seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company',
                        pipeline: [
                            {
                                $project: {
                                    password: 0 // Exclude the password field
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'companyotherinfos',
                        localField: 'buyer_company_id',
                        foreignField: 'company_id',
                        as: 'other_info'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product_id',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $lookup: {
                        from: 'inquiry_statuses',
                        localField: '_id',
                        foreignField: 'inquiry_id',
                        as: 'inquiry_status'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                        other_info: { $arrayElemAt: ['$other_info.logo', 0] },
                        product: { $arrayElemAt: ['$product', 0] },
                        inquiry_status: 1,
                        inquiry_qty: 1,
                        qty_type: 1,
                        inq_type: 1,
                        status: 1,
                        category: 1,
                        subcategory: 1,
                        grade: 1,
                        COA: 1,
                        min_price: 1,
                        inco_terms: 1,
                        max_price: 1,
                        country_origin: 1,
                        hsn_code: 1,
                        supply_capacity: 1,
                        purity: 1,
                        one_lot_qty: 1,
                        one_lot_qty_type: 1,
                        one_lot_qty_price: 1,
                        payment_status: 1,
                        payment_type: 1,
                        total_lot: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);

       
            const updatedBuyingInquiryList = buyerCompanyInquiries.map(item => {
                // if (item.COA) {
                //     item.COA = `${baseURL}${item.COA}`;
                // }
                if (item.product && item.product.structure) {
                    item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
                }
                return item;
            });

            res.status(200).json({
                success: true,
                message: "sallercompany Details succussfully",
                data: updatedBuyingInquiryList
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const inquiryDetailsById = async (req, res) => {
    try {

        const decodedToken = verifyAccessToken(req.headers.authorization.split(" ")[1]);
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is superadmin or admin
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
        let { id } = req.params

        let inquiryDetails = await Inquiry.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $lookup: {
                    from: 'salesinvoices',
                    localField: '_id',
                    foreignField: 'inquiry_id',
                    as: 'po_details'
                }
            },
            {
                $lookup: {
                    from: 'inquiry_statuses',
                    localField: '_id',
                    foreignField: 'inquiry_id',
                    as: 'inquiry_status_details'
                }
            },
            {
                $lookup: {
                    from: 'chats',
                    localField: '_id',
                    foreignField: 'inquiryId',
                    as: 'message_details',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'senderId',
                                foreignField: '_id',
                                as: 'sender_Details',
                                pipeline: [
                                    {
                                        $project: {
                                            company_name: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'receiverId',
                                foreignField: '_id',
                                as: 'receiver_Details',
                                pipeline: [
                                    {
                                        $project: {
                                            company_name: 1
                                        }
                                    }
                                ]
                            }
                        },
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    inquiry_id: '$_id',
                    buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    po_details: 1,
                    inquiry_status_details: 1,
                    message_details: 1,
                    inquiry_qty: 1,
                    qty_type: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    hsn_code: 1,
                    COA: 1,
                    min_price: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    inco_term: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!inquiryDetails) {
            return res.status(200).json({
                success: true,
                message: "Inquiry Not Available",
                data: []
            })
        }

       

        for (let inquiry of inquiryDetails) {
            for (let poDetail of inquiry.po_details) {
                if (poDetail.upload_COA) {
                    poDetail.upload_COA = `${Azure_Storage_Base_Url}${poDetail.upload_COA}`;
                }
                if (poDetail.upload_po) {
                    poDetail.upload_po = `${Azure_Storage_Base_Url}${poDetail.upload_po}`;
                }
                if (poDetail.lr_copy) {
                    poDetail.lr_copy = `${Azure_Storage_Base_Url}${poDetail.lr_copy}`;
                }
                if (poDetail.lori_copy) {
                    poDetail.lori_copy = `${Azure_Storage_Base_Url}${poDetail.lori_copy}`;
                }
            }
        }

        const InquiryList = inquiryDetails.map(item => {
            // if (item.COA) {
            //     item.COA = `${baseURL}${item.COA}`;
            // }
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        res.status(200).json({
            success: true,
            message: "Inquiry Details Find Successfully",
            data: InquiryList
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

const inquiryDetailsForCompany = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company' && decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let { id } = req.params;

        let inquiryDetails = await Inquiry.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companyotherinfos',
                                localField: '_id',
                                foreignField: 'company_id',
                                as: 'buyer_other_info'
                            }
                        },
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companyotherinfos',
                                localField: '_id',
                                foreignField: 'company_id',
                                as: 'seller_other_info'
                            }
                        },
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $lookup: {
                    from: 'salesinvoices',
                    localField: '_id',
                    foreignField: 'inquiry_id',
                    as: 'po_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'buyer_company_id',
                                foreignField: '_id',
                                as: 'buyer_company_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'seller_company_id',
                                foreignField: '_id',
                                as: 'seller_company_details'
                            }
                        },
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'inquiry_statuses',
                    localField: '_id',
                    foreignField: 'inquiry_id',
                    as: 'inquiry_status'
                }
            },
            {
                $project: {
                    _id: 0,
                    inquiry_id: '$_id',
                    buyer_company: { $arrayElemAt: ['$buyer_company', 0] },
                    seller_company: { $arrayElemAt: ['$seller_company', 0] },
                    product: { $arrayElemAt: ['$product', 0] },
                    inquiry_status: 1,
                    po_data: 1,
                    inquiry_qty: 1,
                    qty_type: 1,
                    hsn_code: 1,
                    inq_type: 1,
                    status: 1,
                    category: 1,
                    subcategory: 1,
                    grade: 1,
                    COA: 1,
                    min_price: 1,
                    max_price: 1,
                    country_origin: 1,
                    supply_capacity: 1,
                    purity: 1,
                    inco_terms: 1,
                    one_lot_qty: 1,
                    one_lot_qty_type: 1,
                    one_lot_qty_price: 1,
                    payment_status: 1,
                    payment_type: 1,
                    total_lot: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $unset: [
                    'buyer_company.password',
                    'buyer_company.buyer_other_info.password',
                    'seller_company.password',
                    'seller_company.seller_other_info.password',
                    'po_data.buyer_company_details.password',
                    'po_data.seller_company_details.password'
                ]
            }
        ]);

        if (!inquiryDetails) {
            return res.status(200).json({
                success: true,
                message: "Inquiry Not Available",
                data: []
            });
        }
    
        for (let inquiry of inquiryDetails) {
            for (let poDetail of inquiry.po_data) {
                if (poDetail.upload_COA) {
                    poDetail.upload_COA = `${Azure_Storage_Base_Url}${poDetail.upload_COA}`;
                    
                }
                if (poDetail.upload_po) {
                    poDetail.upload_po = `${Azure_Storage_Base_Url}${poDetail.upload_po}`;
                }
                if (poDetail.lr_copy) {
                    poDetail.lr_copy = `${Azure_Storage_Base_Url}${poDetail.lr_copy}`;
                }
                if (poDetail.lori_copy) {
                    poDetail.lori_copy = `${Azure_Storage_Base_Url}${poDetail.lori_copy}`;
                }
            }

            if (inquiry.buyer_company && inquiry.buyer_company.buyer_other_info && inquiry.buyer_company.buyer_other_info.length > 0) {
                let buyerOtherInfo = inquiry.buyer_company.buyer_other_info[0];
                if (buyerOtherInfo.logo) {
                    buyerOtherInfo.logo = `${Azure_Storage_Base_Url}${buyerOtherInfo.logo}`;
                }
            }

            if (inquiry.seller_company && inquiry.seller_company.seller_other_info && inquiry.seller_company.seller_other_info.length > 0) {
                let sellerOtherInfo = inquiry.seller_company.seller_other_info[0];
                if (sellerOtherInfo.logo) {
                    sellerOtherInfo.logo = `${Azure_Storage_Base_Url}${sellerOtherInfo.logo}`;
                }
            }
        }

        const InquiryList = inquiryDetails.map(item => {
            if (item.product && item.product.structure) {
                item.product.structure = `${Azure_Storage_Base_Url}${item.product.structure}`;
            }
            return item;
        });

        // console.log("dd",InquiryList);

        res.status(200).json({
            success: true,
            message: "Inquiry Details Find Successfully",
            data: InquiryList
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const allInquiryCancelStatus = async (req, res) => {
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

        const { inquiryIds } = req.body;



        if (!inquiryIds || !Array.isArray(inquiryIds) || inquiryIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No Inquiry IDs provided' });
        }

        let findInquiry = await Inquiry.find({
            _id: { $in: inquiryIds },
            buyer_company_id: decodedToken.companyId
        });

        if (findInquiry.length !== inquiryIds.length) {
            return res.status(400).json({ success: false, message: 'Some Inquiry IDs are invalid or do not belong to the company' });
        }


        let updateStatus = await Inquiry.updateMany(
            { _id: { $in: inquiryIds } },
            { $set: { status: 'cancel' } }
        );

        await inquiry_status.updateMany(
            { inquiry_id: { $in: inquiryIds } },
            { $push: { inquiry_status_value: [{ status: 'Cancel' }] } }
        )

        res.status(200).json({
            success: true,
            message: "Specified Inquiry Statuses Updated Successfully",
            data: updateStatus
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}







module.exports = {
    addInquiry: [verifyToken, addInquiry], // Use token verification middleware before executing addInquiry function
    displayBuyingInquiryList: [verifyToken, displayBuyingInquiryList], // Use token verification middleware before executing addInquiry function
    displayBuyingInquiryDetailsById: [verifyToken, displayBuyingInquiryDetailsById], // Use token verification middleware before executing addInquiry function
    displayBuyingInquirySampleDetails: [verifyToken, displayBuyingInquirySampleDetails], // Use token verification middleware before executing addInquiry function
    displaySellingInquiryList: [verifyToken, displaySellingInquiryList], // Use token verification middleware before executing addInquiry function
    displaySellingInquiryDetailsById: [verifyToken, displaySellingInquiryDetailsById], // Use token verification middleware before executing addInquiry function
    displaySellingInquirySampleDetails: [verifyToken, displaySellingInquirySampleDetails], // Use token verification middleware before executing addInquiry function
    displayAllInquiries: [verifyToken, displayAllInquiries], // Use token verification middleware before executing addInquiry function
    updateInquiryStatus: [verifyToken, updateInquiryStatus],
    displayBuyerInquiryList: [verifyToken, displayBuyerInquiryList],
    displayBuyercpmpanyAndSallercompany: [verifyToken, displayBuyercpmpanyAndSallercompany],
    inquiryDetailsById: [verifyToken, inquiryDetailsById],
    inquiryDetailsForCompany: [verifyToken, inquiryDetailsForCompany],
    inquiryStatusChange: [verifyToken, inquiryStatusChange],
    allInquiryCancelStatus: [verifyToken, allInquiryCancelStatus],
    verifyAccessToken
};



