const mongoose = require("mongoose");
const SalesInvoice = require("../models/salesInvoice");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");
const Inquiry = require("../models/inquiry");
const inquiry_status = require("../models/inquiry_status");
const Notification = require('../models/notification');
const { getReceiverSocketId, io } = require("../socket/socket");
const Product = require("../models/productModel")
const Company = require("../models/company")
const Company_otherinfo = require('../models/company_otherinfo');
const MyDesign = require("../models/myDesign");
const CancelPoMsg = require("../models/cancelPoMsg");
const {Azure_Storage_Base_Url} = require("../utils/blobUrl");
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");



// const insertSalesInvoice = async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's role is 'company'
//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         if (!req.body.inquiry_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Inquiry id is required!"
//             })
//         }

//         // let findPoData = await SalesInvoice.findOne({ inquiry_id: req.body.inquiry_id, invoice_type: 'po' })

//         if (req.body.invoice_type === 'po')
//             if (!req.body.bill_to_gst_in || req.body.termsand_condition || !req.body.bill_to_name || !req.body.bill_to_address || !req.body.bill_to_country || !req.body.bill_to_state || !req.body.bill_to_city || !req.body.bill_to_pincode || !req.body.bill_to_phone || !req.body.shipped_to_gst_in || !req.body.shipped_to_name || !req.body.shipped_to_address || !req.body.shipped_to_country || !req.body.shipped_to_state || !req.body.shipped_to_city || !req.body.shipped_to_pincode || !req.body.shipped_to_phone || !req.body.po_num || !req.body.po_date || !req.body.product_details || !req.body.bank_branch || !req.body.bank_name || !req.body.bank_IFSC_code || !req.body.bank_account_num || !req.body.inco_terms || !req.body.payment_terms || !req.body.delivery_time) {
//                 return res.status(400).json({ success: false, message: 'Missing required fields for po ' });
//             }



//         let salesData = new SalesInvoice({
//             buyer_company_id: decodedToken.companyId,
//             inquiry_id: req.body.inquiry_id,
//             seller_company_id: req.body.seller_company_id,
//             bill_to_gst_in: req.body.bill_to_gst_in,
//             bill_to_name: req.body.bill_to_name,
//             bill_to_address: req.body.bill_to_address,
//             bill_to_country: req.body.bill_to_country,
//             bill_to_state: req.body.bill_to_state,
//             bill_to_city: req.body.bill_to_city,
//             bill_to_pincode: req.body.bill_to_pincode,
//             bill_to_phone: req.body.bill_to_phone,
//             shipped_to_gst_in: req.body.shipped_to_gst_in,
//             shipped_to_name: req.body.shipped_to_name,
//             shipped_to_address: req.body.shipped_to_address,
//             shipped_to_country: req.body.shipped_to_country,
//             shipped_to_state: req.body.shipped_to_state,
//             shipped_to_city: req.body.shipped_to_city,
//             shipped_to_pincode: req.body.shipped_to_pincode,
//             shipped_to_phone: req.body.shipped_to_phone,
//             invoice_no: req.body.invoice_no,
//             po_num: req.body.po_num,
//             upload_po: upload_po,
//             eway_no: req.body.eway_no,
//             vehicle_no: req.body.vehicle_no,
//             inco_terms: req.body.inco_terms,
//             payment_terms: req.body.payment_terms,
//             delivery_time: req.body.delivery_time,
//             upload_COA: upload_COA,
//             packaging_no_of_bags: req.body.packaging_no_of_bags,
//             packaging_type: req.body.packaging_type,
//             packaging_weight: req.body.packaging_weight,
//             packaging_weight_type: req.body.packaging_weight_type,
//             grand_total: req.body.grand_total,
//             termsand_condition: req.body.termsand_condition,
//             upload_sign: upload_sign,
//             upload_stamp: upload_stamp,
//             invoice_type: req.body.invoice_type,
//             invoice_mode: req.body.invoice_mode,
//             bank_name: req.body.bank_name,
//             bank_branch: req.body.bank_branch,
//             bank_IFSC_code: req.body.bank_IFSC_code,
//             bank_account_num: req.body.bank_account_num,
//             product_details: req.body.product_details

//         });
//         let result = await salesData.save();
//         res.status(200).json({
//             success: true,
//             message: "SalesInvoice Add Successfully",
//             data: result
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error!"
//         })
//     }
// }

const insertSalesInvoice = async (req, res) => {
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

        let inquirysData = await Inquiry.findOne({ _id: req.body.inquiry_id })
        let otherInfo = await Company_otherinfo.findOne({ company_id: decodedToken.companyId });

        let companylogo = "";
        let logo = "";

        if (otherInfo) {
            companylogo = otherInfo.logo;
        }

        let designData = await MyDesign.findOne({ company_id: decodedToken.companyId });

        if (companylogo) {
            logo = Azure_Storage_Base_Url + companylogo;
        } else {
            logo = "";
        }


        if (req.body.invoice_type === 'po' && (req.body.invoice_mode === 'manual' || req.body.invoice_mode === 'auto')) {

            const requiredFields = [
                'bill_to_gst_in',
                'bill_to_name',
                'bill_to_address',
                'bill_to_country',
                'bill_to_state',
                'bill_to_city',
                'bill_to_pincode',
                'bill_to_phone',
                'shipped_to_gst_in',
                'shipped_to_name',
                'shipped_to_address',
                'shipped_to_country',
                'shipped_to_state',
                'shipped_to_city',
                'shipped_to_pincode',
                'shipped_to_phone',
                'po_num',
                'po_date',
                // 'product_details',
                'grand_total',
                'termsand_condition',
                'upload_sign',
                'upload_stamp',
                'invoice_type',
                'invoice_mode',
                'seller_to_name',
                'seller_to_address',
                'seller_to_country',
                'seller_to_state',
                'seller_to_city',
                'seller_to_pincode',
                'seller_to_phone',
            ];

            // Function to check and return individual validation errors
            const validateFields = (body) => {
                const errors = [];

                if (!body.bill_to_gst_in) errors.push('bill to gst_in is required');
                if (!body.bill_to_name) errors.push('bill to name is required');
                if (!body.bill_to_address) errors.push('bill to address is required');
                if (!body.bill_to_country) errors.push('bill to country is required');
                if (!body.bill_to_state) errors.push('bill to state is required');
                if (!body.bill_to_city) errors.push('bill to city is required');

                if (!body.bill_to_pincode) {
                    errors.push('bill to pincode is required');
                } else if (!/^\d{6}$/.test(body.bill_to_pincode)) {
                    errors.push('bill to pincode must be a 6-digit number');
                }

                if (!body.bill_to_phone) {
                    errors.push('bill to phone is required');
                } else if (!/^\d{10}$/.test(body.bill_to_phone)) {
                    errors.push('bill to phone must be a 10-digit number');
                }

                if (!body.shipped_to_gst_in) errors.push('shipped to gst in is required');
                if (!body.shipped_to_name) errors.push('shipped to name is required');
                if (!body.shipped_to_address) errors.push('shipped to address is required');
                if (!body.shipped_to_country) errors.push('shipped to country is required');
                if (!body.shipped_to_state) errors.push('shipped to state is required');
                if (!body.shipped_to_city) errors.push('shipped to city is required');


                if (!body.shipped_to_pincode) {
                    errors.push('shipped to pincode is required');
                } else if (!/^\d{6}$/.test(body.shipped_to_pincode)) {
                    errors.push('shipped to pincode must be a 6-digit number');
                }

                if (!body.shipped_to_phone) {
                    errors.push('shipped to phone is required');
                } else if (!/^\d{10}$/.test(body.shipped_to_phone)) {
                    errors.push('shipped to phone must be a 10-digit number');
                }

                if (!body.po_num) errors.push('po num is required');
                if (!body.po_date) errors.push('po date is required');

                if (!body.grand_total) errors.push('grand total is required');
                if (!body.termsand_condition) errors.push('termsand condition is required');
                if (!body.upload_sign) errors.push('upload sign is required');
                if (!body.upload_stamp) errors.push('upload stamp is required');
                if (!body.invoice_type) errors.push('invoice type is required');
                if (!body.invoice_mode) errors.push('invoice mode is required');

                if (!body.seller_to_name) errors.push('seller to name is required');
                if (!body.seller_to_address) errors.push('seller to address is required');
                if (!body.seller_to_country) errors.push('seller to country is required');
                if (!body.seller_to_state) errors.push('seller to state is required');
                if (!body.seller_to_city) errors.push('seller to city is required');


                if (!body.seller_to_pincode) {
                    errors.push('seller to pincode is required');
                } else if (!/^\d{6}$/.test(body.seller_to_pincode)) {
                    errors.push('seller to pincode must be a 6-digit number');
                }

                if (!body.seller_to_phone) {
                    errors.push('seller to phone is required');
                } else if (!/^\d{10}$/.test(body.seller_to_phone)) {
                    errors.push('seller to phone must be a 10-digit number');
                }

                return errors;
            };

            // Use the validation function and return appropriate error messages
            const missingFields = validateFields(req.body);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                });
            }

            let poData = new SalesInvoice({
                buyer_company_id: decodedToken.companyId,
                seller_company_id: req.body.seller_company_id,
                inquiry_id: req.body.inquiry_id,
                bill_to_gst_in: req.body.bill_to_gst_in,
                bill_to_name: req.body.bill_to_name,
                bill_to_address: req.body.bill_to_address,
                bill_to_country: req.body.bill_to_country,
                bill_to_state: req.body.bill_to_state,
                bill_to_city: req.body.bill_to_city,
                bill_to_pincode: req.body.bill_to_pincode,
                bill_to_phone: req.body.bill_to_phone,
                shipped_to_gst_in: req.body.shipped_to_gst_in,
                shipped_to_name: req.body.shipped_to_name,
                shipped_to_address: req.body.shipped_to_address,
                shipped_to_country: req.body.shipped_to_country,
                shipped_to_state: req.body.shipped_to_state,
                shipped_to_city: req.body.shipped_to_city,
                shipped_to_pincode: req.body.shipped_to_pincode,
                shipped_to_phone: req.body.shipped_to_phone,
                po_num: req.body.po_num,
                po_date: req.body.po_date,
                product_details: req.body.product_details,
                grand_total: req.body.grand_total,
                bank_details: req.body.bank_details,
                termsand_condition: req.body.termsand_condition,
                upload_sign: req.body.upload_sign,
                upload_stamp: req.body.upload_stamp,
                invoice_type: req.body.invoice_type,
                invoice_mode: req.body.invoice_mode,
                inco_terms: req.body.inco_terms,
                payment_terms: req.body.payment_terms,
                // delivery_time: req.body.delivery_time,
                ...(inquirysData && inquirysData.inq_type && { inq_type: inquirysData.inq_type }),
                seller_to_gst_in: req.body.seller_to_gst_in,
                seller_to_name: req.body.seller_to_name,
                seller_to_address: req.body.seller_to_address,
                seller_to_country: req.body.seller_to_country,
                seller_to_state: req.body.seller_to_state,
                seller_to_city: req.body.seller_to_city,
                seller_to_pincode: req.body.seller_to_pincode,
                seller_to_phone: req.body.seller_to_phone,
                bill_to_logo: logo,
                design: designData ? designData.po_design : '',
                mode_of_transport: req.body.mode_of_transport
            });
            let poResult = await poData.save();

            const companyDetails = await SalesInvoice.aggregate([
                {
                    $match: { _id: poResult._id }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
                        pipeline: [
                            {
                                $project: {
                                    password: 0 // Exclude the password field
                                }
                            }
                        ]
                    }
                },
            ]);

            const response = {
                ...poResult.toObject(),
                buyer_company_details: companyDetails[0].buyer_company_details
            };


            if (req.body.invoice_mode === 'manual') {
                return res.status(200).json({
                    success: true,
                    message: "Po Insert Successfully",
                    data: response
                });
            } else if (req.body.invoice_mode === 'auto') {
                let inquiryData = await Inquiry.findOne({ _id: req.body.inquiry_id })


                let productids = inquiryData.product_id
                let buyer_id = inquiryData.buyer_company_id

                let company_name = await Company.findOne({ _id: buyer_id })
                let product_name = await Product.findOne({ _id: productids })

                const notificationData = await Notification.create({
                    title: "Po Generated",
                    company_id: inquiryData.seller_company_id,
                    inquiry_id: inquiryData._id,
                    message: `Po generated by ${company_name.company_name} of ${product_name.name_of_chemical} Successfully`
                })

                const sellerSocketId = getReceiverSocketId(inquiryData.seller_company_id); // Implement this function to get the seller's socket ID
                if (sellerSocketId) {
                    io.to(sellerSocketId).emit('newNotification', notificationData);
                }

                // console.log("invoice insert socket log :", sellerSocketId)
                // console.log("invoice insert log :", notificationData)

                await Inquiry.findOneAndUpdate({ _id: inquiryData }, { status: 'po' }
                    , { new: true });


                io.to(getReceiverSocketId(inquiryData.buyer_company_id)).emit('statusChanged', {
                    status: 'po',
                });

                io.to(getReceiverSocketId(inquiryData.seller_company_id)).emit('statusChanged', {
                    status: 'po',
                });


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: req.body.inquiry_id }, { $push: { inquiry_status_value: [{ status: 'Po' }] } }, { new: true });
                const inquiryStatusSocket = getReceiverSocketId(inquiryData.buyer_company_id); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                // console.log("inquiry socket log :", inquiryStatusSocket)
                // console.log("ashdga :", updateData)



                return res.status(200).json({
                    success: true,
                    message: "Po Insert Successfully",
                    data: response
                });
            }

        } else if (req.body.invoice_type === 'tax_invoice' && (req.body.invoice_mode === 'manual' || req.body.invoice_mode === 'auto')) {

            const requiredFields = [
                'bill_to_gst_in',
                'bill_to_name',
                'bill_to_address',
                'bill_to_country',
                'bill_to_state',
                'bill_to_city',
                'bill_to_pincode',
                // 'bill_to_phone',
                'shipped_to_gst_in',
                'shipped_to_name',
                'shipped_to_address',
                'shipped_to_country',
                'shipped_to_state',
                'shipped_to_city',
                'shipped_to_pincode',
                // 'shipped_to_phone',
                'product_details',
            ];

            const validateFields = (body) => {
                const errors = [];

                if (!body.bill_to_gst_in) errors.push('bill to gst_in is required');
                if (!body.bill_to_name) errors.push('bill to name is required');
                if (!body.bill_to_address) errors.push('bill to address is required');
                if (!body.bill_to_country) errors.push('bill to country is required');
                if (!body.bill_to_state) errors.push('bill to state is required');
                if (!body.bill_to_city) errors.push('bill to city is required');

                if (!body.bill_to_pincode) {
                    errors.push('bill to pincode is required');
                } else if (!/^\d{6}$/.test(body.bill_to_pincode)) {
                    errors.push('bill to pincode must be a 6-digit number');
                }

                // if (!body.bill_to_phone) {
                //     errors.push('bill to phone is required');
                // } else if (!/^\d{10}$/.test(body.bill_to_phone)) {
                //     errors.push('bill to phone must be a 10-digit number');
                // }

                if (!body.shipped_to_gst_in) errors.push('shipped to gst in is required');
                if (!body.shipped_to_name) errors.push('shipped to name is required');
                if (!body.shipped_to_address) errors.push('shipped to address is required');
                if (!body.shipped_to_country) errors.push('shipped to country is required');
                if (!body.shipped_to_state) errors.push('shipped to state is required');
                if (!body.shipped_to_city) errors.push('shipped to city is required');


                if (!body.shipped_to_pincode) {
                    errors.push('shipped to pincode is required');
                } else if (!/^\d{6}$/.test(body.shipped_to_pincode)) {
                    errors.push('shipped to pincode must be a 6-digit number');
                }

                // if (!body.shipped_to_phone) {
                //     errors.push('shipped to phone is required');
                // } else if (!/^\d{10}$/.test(body.shipped_to_phone)) {
                //     errors.push('shipped to phone must be a 10-digit number');
                // }

                return errors;
            };

            // Use the validation function and return appropriate error messages
            const missingFields = validateFields(req.body);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                });
            }

            // here we have to upload in blobe.

            let uniqueFileNameUpload_po

            if(req.files?.upload_po?.[0]){
                let uploadResultUpload_po = await uploadToAzureBlob(req.files?.upload_po?.[0]);
                uniqueFileNameUpload_po = uploadResultUpload_po?.uniqueFileName;
            }

            let uniqueFileNameUpload_COA

            if(req.files?.upload_COA?.[0]){
                let uploadResultUpload_COA = await uploadToAzureBlob(req.files?.upload_COA?.[0]);
                uniqueFileNameUpload_COA = uploadResultUpload_COA?.uniqueFileName;
            }
            

            

            let textInvoiceData = new SalesInvoice({
                buyer_company_id: req.body.buyer_company_id,
                seller_company_id: decodedToken.companyId,
                inquiry_id: req.body.inquiry_id,
                bill_to_gst_in: req.body.bill_to_gst_in,
                bill_to_name: req.body.bill_to_name,
                bill_to_address: req.body.bill_to_address,
                bill_to_country: req.body.bill_to_country,
                bill_to_state: req.body.bill_to_state,
                bill_to_city: req.body.bill_to_city,
                bill_to_pincode: req.body.bill_to_pincode,
                ...(req.body.bill_to_phone !=="null" && { bill_to_phone: req.body.bill_to_phone }),
                // bill_to_phone: req.body.bill_to_phone,
                shipped_to_gst_in: req.body.shipped_to_gst_in,
                shipped_to_name: req.body.shipped_to_name,
                shipped_to_address: req.body.shipped_to_address,
                shipped_to_country: req.body.shipped_to_country,
                shipped_to_state: req.body.shipped_to_state,
                shipped_to_city: req.body.shipped_to_city,
                shipped_to_pincode: req.body.shipped_to_pincode,
                ...(req.body.shipped_to_phone !=="null" && { shipped_to_phone: req.body.shipped_to_phone }),
                // shipped_to_phone: req.body.shipped_to_phone,
                invoice_no: req.body.invoice_no,
                invoice_date: req.body.invoice_date,
                due_date: req.body.due_date,
                po_num: req.body.po_num,
                po_date: req.body.po_date,
                ...(uniqueFileNameUpload_po && { upload_po: uniqueFileNameUpload_po }),
                eway_no: req.body.eway_no,
                vehicle_no: req.body.vehicle_no,
                ...(uniqueFileNameUpload_COA && { upload_COA: uniqueFileNameUpload_COA }),
                packaging_no_of_bags: req.body.packaging_no_of_bags,
                packaging_type: req.body.packaging_type,
                packaging_weight: req.body.packaging_weight,
                packaging_weight_type: req.body.packaging_weight_type,
                product_details: req.body.product_details,
                grand_total: req.body.grand_total,
                bank_details: req.body.bank_details,
                termsand_condition: req.body.termsand_condition,
                upload_sign: req.body.upload_sign,
                upload_stamp: req.body.upload_stamp,
                invoice_type: req.body.invoice_type,
                invoice_mode: req.body.invoice_mode,
                inco_terms: req.body.inco_terms,
                payment_terms: req.body.payment_terms,
                delivery_time: req.body.delivery_time,
                ...(inquirysData && inquirysData.inq_type && { inq_type: inquirysData.inq_type }),
                bill_to_logo: logo,
                design: designData ? designData.invoice_design : '',
                mode_of_transport: req.body.mode_of_transport
            });
            let textInvoiceResult = await textInvoiceData.save();

            const companyDetails = await SalesInvoice.aggregate([
                {
                    $match: { _id: textInvoiceResult._id }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'seller_company_id',
                        foreignField: '_id',
                        as: 'seller_company_details',
                        pipeline: [
                            {
                                $project: {
                                    password: 0 // Exclude the password field
                                }
                            }
                        ]
                    }
                },
            ]);

            const response = {
                ...textInvoiceResult.toObject(),
                seller_company_details: companyDetails[0].seller_company_details
            };
            // console.log("company Details :", response)


            if (req.body.invoice_mode === 'manual') {
                return res.status(200).json({
                    success: true,
                    message: "Tex-Invoice Add Succuccfully",
                    data: response
                })
            } else if (req.body.invoice_mode === 'auto') {
                let inquiryData = await Inquiry.findOne({ _id: req.body.inquiry_id })

                let productids = inquiryData.product_id
                let seller_id = inquiryData.seller_company_id

                let company_name = await Company.findOne({ _id: seller_id })
                let product_name = await Product.findOne({ _id: productids })


                const notificationData = await Notification.create({
                    title: "Invoice Generated",
                    company_id: inquiryData.buyer_company_id,
                    inquiry_id: inquiryData._id,
                    message: `Invoice generated by ${company_name.company_name} of ${product_name.name_of_chemical} Successfully`
                })

                const buyerSocketId = getReceiverSocketId(inquiryData.buyer_company_id); // Implement this function to get the seller's socket ID
                if (buyerSocketId) {
                    io.to(buyerSocketId).emit('newNotification', notificationData);
                }

                // console.log("invoice insert socket log :", buyerSocketId)
                // console.log("invoice insert log :", notificationData)


                await Inquiry.findOneAndUpdate({ _id: req.body.inquiry_id }, { status: 'invoice' }, { new: true });

                io.to(getReceiverSocketId(inquiryData.buyer_company_id)).emit('statusChanged', {
                    status: 'invoice',
                });

                io.to(getReceiverSocketId(inquiryData.seller_company_id)).emit('statusChanged', {
                    status: 'invoice',
                });

                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: req.body.inquiry_id }, { $push: { inquiry_status_value: [{ status: 'Invoice' }] } }, { new: true });

                const inquiryStatusSocket = getReceiverSocketId(inquiryData.seller_company_id); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }

                // console.log("inquiry socket log :", inquiryStatusSocket)
                // console.log("ashdga :", updateData)


                return res.status(200).json({
                    success: true,
                    message: "Tex-Invoice Add Succuccfully",
                    data: response
                })
            }
        } else if (req.body.invoice_type === 'performa_invoice' && (req.body.invoice_mode === 'manual' || req.bodyt.invoice_mode === 'auto')) {
            const requiredFields = [
                'bill_to_gst_in',
                'bill_to_name',
                'bill_to_address',
                'bill_to_country',
                'bill_to_state',
                'bill_to_city',
                'bill_to_pincode',
                'bill_to_phone',
                'shipped_to_gst_in',
                'shipped_to_name',
                'shipped_to_address',
                'shipped_to_country',
                'shipped_to_state',
                'shipped_to_city',
                'shipped_to_pincode',
                'shipped_to_phone',
                'product_details',
            ];

            const validateFields = (body) => {
                const errors = [];

                if (!body.bill_to_gst_in) errors.push('bill to gst_in is required');
                if (!body.bill_to_name) errors.push('bill to name is required');
                if (!body.bill_to_address) errors.push('bill to address is required');
                if (!body.bill_to_country) errors.push('bill to country is required');
                if (!body.bill_to_state) errors.push('bill to state is required');
                if (!body.bill_to_city) errors.push('bill to city is required');

                if (!body.bill_to_pincode) {
                    errors.push('bill to pincode is required');
                } else if (!/^\d{6}$/.test(body.bill_to_pincode)) {
                    errors.push('bill to pincode must be a 6-digit number');
                }

                // if (!body.bill_to_phone) {
                //     errors.push('bill to phone is required');
                // } else if (!/^\d{10}$/.test(body.bill_to_phone)) {
                //     errors.push('bill to phone must be a 10-digit number');
                // }

                if (!body.shipped_to_gst_in) errors.push('shipped to gst in is required');
                if (!body.shipped_to_name) errors.push('shipped to name is required');
                if (!body.shipped_to_address) errors.push('shipped to address is required');
                if (!body.shipped_to_country) errors.push('shipped to country is required');
                if (!body.shipped_to_state) errors.push('shipped to state is required');
                if (!body.shipped_to_city) errors.push('shipped to city is required');


                if (!body.shipped_to_pincode) {
                    errors.push('shipped to pincode is required');
                } else if (!/^\d{6}$/.test(body.shipped_to_pincode)) {
                    errors.push('shipped to pincode must be a 6-digit number');
                }

                // if (!body.shipped_to_phone) {
                //     errors.push('shipped to phone is required');
                // } else if (!/^\d{10}$/.test(body.shipped_to_phone)) {
                //     errors.push('shipped to phone must be a 10-digit number');
                // }

                return errors;
            };

            // Use the validation function and return appropriate error messages
            const missingFields = validateFields(req.body);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                });
            }

            let uniqueFileNameUpload_po=null;

            if(req.files?.upload_po?.[0]){
                let uploadResultUpload_po = await uploadToAzureBlob(req.files?.upload_po?.[0]);

                uniqueFileNameUpload_po = uploadResultUpload_po?.uniqueFileName;
            }

            let performaInvoice = new SalesInvoice({
                buyer_company_id: req.body.buyer_company_id,
                seller_company_id: decodedToken.companyId,
                inquiry_id: req.body.inquiry_id,
                bill_to_gst_in: req.body.bill_to_gst_in,
                bill_to_name: req.body.bill_to_name,
                bill_to_address: req.body.bill_to_address,
                bill_to_country: req.body.bill_to_country,
                bill_to_state: req.body.bill_to_state,
                bill_to_city: req.body.bill_to_city,
                bill_to_pincode: req.body.bill_to_pincode,
                ...(req.body.bill_to_phone !== "null" && { bill_to_phone: req.body.bill_to_phone }),
                // bill_to_phone: req.body.bill_to_phone,
                shipped_to_gst_in: req.body.shipped_to_gst_in,
                shipped_to_name: req.body.shipped_to_name,
                shipped_to_address: req.body.shipped_to_address,
                shipped_to_country: req.body.shipped_to_country,
                shipped_to_state: req.body.shipped_to_state,
                shipped_to_city: req.body.shipped_to_city,
                shipped_to_pincode: req.body.shipped_to_pincode,
                ...(req.body.shipped_to_phone !== "null" && { shipped_to_phone: req.body.shipped_to_phone }),
                // shipped_to_phone: req.body.shipped_to_phone,
                invoice_no: req.body.invoice_no,
                invoice_date: req.body.invoice_date,
                invoice_type: req.body.invoice_type,
                invoice_mode: req.body.invoice_mode,
                grand_total: req.body.grand_total,
                upload_po: uniqueFileNameUpload_po,
                po_num: req.body.po_num,
                po_date: req.body.po_date,
                termsand_condition: req.body.termsand_condition,
                inco_terms: req.body.inco_terms,
                payment_terms: req.body.payment_terms,
                upload_sign: req.body.upload_sign,
                upload_stamp: req.body.upload_stamp,
                delivery_time: req.body.delivery_time,
                product_details: req.body.product_details,
                bank_details: req.body.bank_details,
                ...(inquirysData && inquirysData.inq_type && { inq_type: inquirysData.inq_type }),
                bill_to_logo: logo,
                due_date: req.body.due_date,
                design: designData ? designData.invoice_design : '',
                mode_of_transport: req.body.mode_of_transport
            });

            let performaInvoiceResult = await performaInvoice.save();

            const companyDetails = await SalesInvoice.aggregate([
                {
                    $match: { _id: performaInvoiceResult._id }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'seller_company_id',
                        foreignField: '_id',
                        as: 'seller_company_details',
                        pipeline: [
                            {
                                $project: {
                                    password: 0 // Exclude the password field
                                }
                            }
                        ]
                    }
                },
            ]);

            const response = {
                ...performaInvoiceResult.toObject(),
                seller_company_details: companyDetails[0].seller_company_details
            };
            // console.log("company Details :", response)

            return res.status(200).json({
                success: true,
                message: "Performa-invoice Add Successfully",
                data: response
            });
        } else {
            res.status(400).json({
                success: false,
                message: "invoice_type and invoice mode not qual to"
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};




const displayListByUser = async (req, res) => {
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



        let invoice_type = req.body.invoice_type;

        if (invoice_type === "po") {
            let poDataDisplay = await SalesInvoice.aggregate([
                {
                    $match: {
                        buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                        // seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                        invoice_type: 'po'
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details'
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
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
                        as: 'seller_company_details',
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
                    $project: {
                        buyer_company_id: 1,
                        seller_company_id: 1,
                        inquiry_id: 1,
                        bill_to_gst_in: 1,
                        bill_to_name: 1,
                        bill_to_address: 1,
                        bill_to_country: 1,
                        bill_to_state: 1,
                        bill_to_city: 1,
                        bill_to_pincode: 1,
                        bill_to_phone: 1,
                        shipped_to_gst_in: 1,
                        shipped_to_name: 1,
                        shipped_to_address: 1,
                        shipped_to_country: 1,
                        shipped_to_state: 1,
                        shipped_to_city: 1,
                        shipped_to_pincode: 1,
                        shipped_to_phone: 1,
                        po_num: 1,
                        po_date: 1,
                        product_details: 1,
                        grand_total: 1,
                        bank_details: 1,
                        termsand_condition: 1,
                        upload_sign: 1,
                        upload_stamp: 1,
                        invoice_type: 1,
                        invoice_mode: 1,
                        inco_terms: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        buyer_company_details: 1,
                        seller_company_details: 1,
                        inquiry_details: 1,
                        dateAndtime: 1,
                        status: 1,
                        inq_type: 1,
                        bill_to_logo: 1,
                        design: 1,
                        mode_of_transport: 1
                    }
                }
            ]);

            if (poDataDisplay.length === 0) {
                return res.status(200).json({ success: false, message: 'No po invoices Available', data: [] });
            }

            poDataDisplay.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }
            });

            return res.status(200).json({
                success: true,
                message: "Po data find successfully",
                data: poDataDisplay
            })
        } else if (invoice_type === "tax_invoice") {
            let tex_invoice_data = await SalesInvoice.aggregate([
                {
                    $match: {
                        seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                        // buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                        invoice_type: 'tax_invoice'
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details'
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
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
                        as: 'seller_company_details',
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
                    $project: {
                        buyer_company_id: 1,
                        seller_company_id: 1,
                        inquiry_id: 1,
                        bill_to_gst_in: 1,
                        bill_to_name: 1,
                        bill_to_address: 1,
                        bill_to_country: 1,
                        bill_to_state: 1,
                        bill_to_city: 1,
                        bill_to_pincode: 1,
                        bill_to_phone: 1,
                        shipped_to_gst_in: 1,
                        shipped_to_name: 1,
                        shipped_to_address: 1,
                        shipped_to_country: 1,
                        shipped_to_state: 1,
                        shipped_to_city: 1,
                        shipped_to_pincode: 1,
                        shipped_to_phone: 1,
                        invoice_no: 1,
                        invoice_date: 1,
                        due_date: 1,
                        po_num: 1,
                        po_date: 1,
                        upload_po: 1,
                        eway_no: 1,
                        vehicle_no: 1,
                        upload_COA: 1,
                        packaging_no_of_bags: 1,
                        packaging_type: 1,
                        packaging_weight: 1,
                        packaging_weight_type: 1,
                        product_details: 1,
                        grand_total: 1,
                        bank_details: 1,
                        termsand_condition: 1,
                        upload_sign: 1,
                        upload_stamp: 1,
                        invoice_type: 1,
                        invoice_mode: 1,
                        inco_terms: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        buyer_company_details: 1,
                        seller_company_details: 1,
                        inquiry_details: 1,
                        dateAndtime: 1,
                        status: 1,
                        inq_type: 1,
                        bill_to_logo: 1,
                        design: 1,
                        mode_of_transport: 1
                    }
                }
            ]);

            if (tex_invoice_data.length === 0) {
                return res.status(200).json({ success: false, message: 'No tex_invoice Available', data: [] });
            }

            tex_invoice_data.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }
            });


            return res.status(200).json({
                success: true,
                message: "tex_invoice data find successfully",
                data: tex_invoice_data
            })

        } else if (invoice_type === "performa_invoice") {
            let performa_invoice_data = await SalesInvoice.aggregate([
                {
                    $match: {
                        seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                        // buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                        invoice_type: 'performa_invoice'
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details'
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
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
                        as: 'seller_company_details',
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
                    $project: {
                        buyer_company_id: 1,
                        seller_company_id: 1,
                        inquiry_id: 1,
                        bill_to_gst_in: 1,
                        bill_to_name: 1,
                        bill_to_address: 1,
                        bill_to_country: 1,
                        bill_to_state: 1,
                        bill_to_city: 1,
                        bill_to_pincode: 1,
                        bill_to_phone: 1,
                        shipped_to_gst_in: 1,
                        shipped_to_name: 1,
                        shipped_to_address: 1,
                        shipped_to_country: 1,
                        shipped_to_state: 1,
                        shipped_to_city: 1,
                        shipped_to_pincode: 1,
                        shipped_to_phone: 1,
                        invoice_no: 1,
                        invoice_date: 1,
                        invoice_type: 1,
                        invoice_mode: 1,
                        po_num: 1,
                        po_date: 1,
                        inco_terms: 1,
                        grand_total: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        product_details: 1,
                        bank_details: 1,
                        upload_po: 1,
                        termsand_condition: 1,
                        upload_sign: 1,
                        upload_stamp: 1,
                        dateAndtime: 1,
                        buyer_company_details: 1,
                        seller_company_details: 1,
                        inquiry_details: 1,
                        status: 1,
                        inq_type: 1,
                        bill_to_logo: 1,
                        mode_of_transport: 1,
                        due_date: 1
                    }
                }
            ]);

            if (performa_invoice_data.length === 0) {
                return res.status(200).json({ success: false, message: 'No sales performa_invoice Available', data: [] });
            }

            performa_invoice_data.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }

            });

            return res.status(200).json({
                success: true,
                message: "performa_invoice data find successfully",
                data: performa_invoice_data
            })
        } else {
            res.status(400).json({
                success: true,
                message: "No Data Found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}



const displayDetails = async (req, res) => {
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

        let { salesInvoiceId } = req.params

        // let salesData = await SalesInvoice.findById(salesInvoiceId)
        let salesData = await SalesInvoice.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(salesInvoiceId) }
            },
            {
                $lookup: {
                    from: 'inquiries',
                    localField: 'inquiry_id',
                    foreignField: '_id',
                    as: 'inquiry_details'
                },
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company_details',
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
                    as: 'seller_company_details',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
        ])


        if (salesData) {

            salesData.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }

            });

            res.status(200).json({
                success: true,
                message: "sales invoices find successfully",
                data: salesData
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Sales invoices not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const displayPoAndInvoiceDetails = async (req, res) => {
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

        let invoice_type = req.body.invoice_type;

        if (invoice_type === "po") {
            let poDataDisplay = await SalesInvoice.aggregate([
                {
                    $match: {
                        invoice_type: 'po',
                        $or: [
                            { buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) },
                            { seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details'
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
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
                        as: 'seller_company_details',
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
                    $project: {
                        buyer_company_id: 1,
                        seller_company_id: 1,
                        inquiry_id: 1,
                        bill_to_gst_in: 1,
                        bill_to_name: 1,
                        bill_to_address: 1,
                        bill_to_country: 1,
                        bill_to_state: 1,
                        bill_to_city: 1,
                        bill_to_pincode: 1,
                        bill_to_phone: 1,
                        shipped_to_gst_in: 1,
                        shipped_to_name: 1,
                        shipped_to_address: 1,
                        shipped_to_country: 1,
                        shipped_to_state: 1,
                        shipped_to_city: 1,
                        shipped_to_pincode: 1,
                        shipped_to_phone: 1,
                        po_num: 1,
                        po_date: 1,
                        product_details: 1,
                        grand_total: 1,
                        bank_details: 1,
                        termsand_condition: 1,
                        upload_sign: 1,
                        upload_stamp: 1,
                        invoice_type: 1,
                        invoice_mode: 1,
                        inco_terms: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        buyer_company_details: 1,
                        seller_company_details: 1,
                        inquiry_details: 1,
                        dateAndtime: 1,
                        status: 1,
                        inq_type: 1,
                        seller_to_gst_in: 1,
                        seller_to_name: 1,
                        seller_to_address: 1,
                        seller_to_country: 1,
                        seller_to_state: 1,
                        seller_to_city: 1,
                        seller_to_pincode: 1,
                        seller_to_phone: 1,
                        bill_to_logo: 1,
                        design: 1,
                        mode_of_transport: 1,
                        due_date: 1
                    }
                }
            ]);

            if (poDataDisplay.length === 0) {
                return res.status(200).json({ success: false, message: 'No po invoices Available', data: [] });
            }

            poDataDisplay.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }

            });

            return res.status(200).json({
                success: true,
                message: "Po data find successfully",
                data: poDataDisplay
            })
        } else if (invoice_type === "tax_invoice") {
            let tex_invoice_data = await SalesInvoice.aggregate([
                {
                    $match: {
                        invoice_type: 'tax_invoice',
                        $or: [
                            { buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) },
                            { seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details'
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
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
                        as: 'seller_company_details',
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
                    $project: {
                        buyer_company_id: 1,
                        seller_company_id: 1,
                        inquiry_id: 1,
                        bill_to_gst_in: 1,
                        bill_to_name: 1,
                        bill_to_address: 1,
                        bill_to_country: 1,
                        bill_to_state: 1,
                        bill_to_city: 1,
                        bill_to_pincode: 1,
                        bill_to_phone: 1,
                        shipped_to_gst_in: 1,
                        shipped_to_name: 1,
                        shipped_to_address: 1,
                        shipped_to_country: 1,
                        shipped_to_state: 1,
                        shipped_to_city: 1,
                        shipped_to_pincode: 1,
                        shipped_to_phone: 1,
                        invoice_no: 1,
                        invoice_date: 1,
                        due_date: 1,
                        po_num: 1,
                        po_date: 1,
                        upload_po: 1,
                        eway_no: 1,
                        vehicle_no: 1,
                        upload_COA: 1,
                        packaging_no_of_bags: 1,
                        packaging_type: 1,
                        packaging_weight: 1,
                        packaging_weight_type: 1,
                        product_details: 1,
                        grand_total: 1,
                        bank_details: 1,
                        termsand_condition: 1,
                        upload_sign: 1,
                        upload_stamp: 1,
                        invoice_type: 1,
                        invoice_mode: 1,
                        inco_terms: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        buyer_company_details: 1,
                        seller_company_details: 1,
                        inquiry_details: 1,
                        dateAndtime: 1,
                        status: 1,
                        inq_type: 1,
                        bill_to_logo: 1,
                        design: 1,
                        mode_of_transport: 1
                    }
                }
            ]);

            if (tex_invoice_data.length === 0) {
                return res.status(200).json({ success: false, message: 'No tex_invoice Available', data: [] });
            }

            tex_invoice_data.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }

            });


            return res.status(200).json({
                success: true,
                message: "tex_invoice data find successfully",
                data: tex_invoice_data
            })
        } else if (invoice_type === "performa_invoice") {
            let perfroma_invoice_data = await SalesInvoice.aggregate([
                {
                    $match: {
                        invoice_type: 'performa_invoice',
                        $or: [
                            { buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) },
                            { seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details'
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_company_id',
                        foreignField: '_id',
                        as: 'buyer_company_details',
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
                        as: 'seller_company_details',
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
                    $project: {
                        buyer_company_id: 1,
                        seller_company_id: 1,
                        inquiry_id: 1,
                        bill_to_gst_in: 1,
                        bill_to_name: 1,
                        bill_to_address: 1,
                        bill_to_country: 1,
                        bill_to_state: 1,
                        bill_to_city: 1,
                        bill_to_pincode: 1,
                        bill_to_phone: 1,
                        shipped_to_gst_in: 1,
                        shipped_to_name: 1,
                        shipped_to_address: 1,
                        shipped_to_country: 1,
                        shipped_to_state: 1,
                        shipped_to_city: 1,
                        shipped_to_pincode: 1,
                        shipped_to_phone: 1,
                        invoice_no: 1,
                        invoice_date: 1,
                        invoice_type: 1,
                        invoice_mode: 1,
                        po_num: 1,
                        po_date: 1,
                        inco_terms: 1,
                        grand_total: 1,
                        payment_terms: 1,
                        delivery_time: 1,
                        product_details: 1,
                        bank_details: 1,
                        upload_po: 1,
                        termsand_condition: 1,
                        upload_sign: 1,
                        upload_stamp: 1,
                        dateAndtime: 1,
                        buyer_company_details: 1,
                        seller_company_details: 1,
                        inquiry_details: 1,
                        status: 1,
                        inq_type: 1,
                        bill_to_logo: 1,
                        design: 1,
                        mode_of_transport: 1,
                        due_date: 1
                    }
                }
            ]);

            if (perfroma_invoice_data.length === 0) {
                return res.status(200).json({ success: false, message: 'No performa_invoice Available', data: [] });
            }

            perfroma_invoice_data.forEach(invoice => {
                if (invoice.upload_po) {
                    invoice.upload_po = Azure_Storage_Base_Url + invoice.upload_po;
                }
                if (invoice.upload_COA) {
                    invoice.upload_COA = Azure_Storage_Base_Url + invoice.upload_COA;
                }

            });


            return res.status(200).json({
                success: true,
                message: "performa_invoice data find successfully",
                data: perfroma_invoice_data
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updatePo = async (req, res) => {
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

        let { poId } = req.query

        let updatedData = await SalesInvoice.findOneAndUpdate({ _id: poId, invoice_type: 'po' }, req.body, { new: true })

        if (!updatedData) {
            return res.status(401).json({
                success: false,
                message: "Po Date Not Found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Po Update Successfully",
            data: updatedData
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const cancelPo = async (req, res) => {
    
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
       
        let { cancelMessage, poId, ...invoiceUpdateData } = req.body


        if(!cancelMessage || !poId){
            return res.status(400).json({
                success:false,
                message:"cancelMessage or poId is missing"
            })
            
        }


        let updatedData = await SalesInvoice.findOneAndUpdate({ _id: poId, invoice_type: 'po' }, invoiceUpdateData, { new: true })

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "PO not found" });
        }

        const invoiceObject= await SalesInvoice.findOne({_id: poId});

        const { inquiry_id: inquiryId, buyer_company_id: buyerId, seller_company_id: sellerId }= invoiceObject;


        if(inquiryId){
            await Inquiry.findByIdAndUpdate({_id:inquiryId},{status:"cancel"});

        }

        let message= new CancelPoMsg({
            salesInvoiceId: poId,
            buyerId,
            sellerId,
            message:cancelMessage
        })
        
        await message.save();

        console.log("po is canceled successfully")
        
        return res.status(200).json({message:"PO cancel successfully",success:true})

       
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

const updateLrCopy = async (req, res) => {
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

        let uploadResult = await uploadToAzureBlob(req.files?.lr_copy?.[0]);

        const uniqueFileName = uploadResult.uniqueFileName;

        let updateData = {
            lr_copy: uniqueFileName,
        }

        let { id } = req.params

        let updatedData = await SalesInvoice.updateOne(
            { _id: id },
            { $set: updateData },
            { new: true }
        );


        res.status(200).json({
            success: true,
            message: "Lr Copy Updated Successfully",
            data: updatedData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateLoriCopy = async (req, res) => {
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

        let uploadResult = await uploadToAzureBlob(req.files?.lori_copy?.[0]);

        const uniqueFileName = uploadResult.uniqueFileName;

        let updateData = {
            lori_copy: uniqueFileName
        }

        let { id } = req.params

        let updatedData = await SalesInvoice.updateOne(
            { _id: id },
            { $set: updateData },
            { new: true }
        );


        res.status(200).json({
            success: true,
            message: "Lori Copy Updated Successfully",
            data: updatedData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const displayPoList = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
        return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Proceed to add inquiry if the user has the required role
    // Check if the user's role is 'superadmin', 'admin', or 'company'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
        return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    const poData = await SalesInvoice.aggregate([
        {
            $match: {
                invoice_type: 'po'
            }
        },
        {
            $lookup: {
                from: 'inquiries',
                localField: 'inquiry_id',
                foreignField: '_id',
                as: 'inquiry_details'
            },
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'buyer_company_id',
                foreignField: '_id',
                as: 'buyer_company_details',
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
                as: 'seller_company_details',
                pipeline: [
                    {
                        $project: {
                            password: 0 // Exclude the password field
                        }
                    }
                ]
            }
        },
    ]);

    res.status(200).json({
        success: true,
        message: "Po Display Successfully",
        data: poData
    })
}

const displayInvoiceList = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
        return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Proceed to add inquiry if the user has the required role
    // Check if the user's role is 'superadmin', 'admin', or 'company'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
        return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    const invoiceData = await SalesInvoice.aggregate([
        {
            $match: {
                $or: [
                    { invoice_type: 'tax_invoice' },
                    { invoice_type: 'performa_invoice' }
                ]
            }
        },
        {
            $lookup: {
                from: 'inquiries',
                localField: 'inquiry_id',
                foreignField: '_id',
                as: 'inquiry_details'
            },
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'buyer_company_id',
                foreignField: '_id',
                as: 'buyer_company_details',
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
                as: 'seller_company_details',
                pipeline: [
                    {
                        $project: {
                            password: 0 // Exclude the password field
                        }
                    }
                ]
            }
        },
    ]);

    res.status(200).json({
        success: true,
        message: "invoice Display Successfully",
        data: invoiceData
    })
}

module.exports = {
    insertSalesInvoice: [verifyToken, insertSalesInvoice],
    displayListByUser: [verifyToken, displayListByUser],
    displayDetails: [verifyToken, displayDetails],
    updatePo: [verifyToken, updatePo],
    displayPoAndInvoiceDetails: [verifyToken, displayPoAndInvoiceDetails],
    updateLrCopy: [verifyToken, updateLrCopy],
    updateLoriCopy: [verifyToken, updateLoriCopy],
    displayPoList: [verifyToken, displayPoList],
    displayInvoiceList: [verifyToken, displayInvoiceList],
    verifyAccessToken,
    cancelPo
}