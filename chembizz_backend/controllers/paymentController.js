const mongoose = require("mongoose");
const Payment = require("../models/payment");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl")



const insertPayment = async (req, res) => {
    try {
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

        let { paid_amount, payment_mode, inquiry_id } = req.body

        let paymentData = new Payment({
            user_id: decodedToken.companyId,
            paid_amount,
            payment_mode,
            inquiry_id
        });

        let result = await paymentData.save();

        res.status(200).json({
            success: true,
            message: "Payment Successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}


const displayList = async (req, res) => {
    try {
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

        let inquiry_id = req.query.inquiry_id

        let displayPaymentData = await Payment.aggregate([
            {
                $match: { inquiry_id: new mongoose.Types.ObjectId(inquiry_id) }
            },
            {
                $lookup: {
                    from: 'inquiries',
                    localField: 'inquiry_id',
                    foreignField: '_id',
                    as: 'Inquiry_details'
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_details',
                    pipeline: [
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ]
                }
            }
        ]);

        if (!displayPaymentData) {
            return res.status(200).json({
                success: true,
                messsge: "No Payment Available",
                payment: []
            })
        }

        res.status(200).json({
            success: true,
            message: "Payment Display Successfully",
            data: displayPaymentData
        })

    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}


const allPaymentList = async (req, res) => {
    try {
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

        const companyId = decodedToken.companyId;

        let paymentList = await Payment.aggregate([
            {
                $lookup: {
                    from: 'inquiries',
                    localField: 'inquiry_id',
                    foreignField: '_id',
                    as: 'Inquiry_details',
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { buyer_company_id: new mongoose.Types.ObjectId(companyId) },
                                    { seller_company_id: new mongoose.Types.ObjectId(companyId) }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'product_id',
                                foreignField: '_id',
                                as: 'product_details',
                            }
                        },
                        {
                            $lookup: {
                                from: 'negotations',
                                localField: '_id',
                                foreignField: 'inquiryId',
                                as: 'negotations_details',
                            }
                        },
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'seller_company_id',
                                foreignField: '_id',
                                as: 'seller_details',
                                pipeline: [
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
                                as: 'status_details',
                            }
                        }
                    ]
                }
            }
        ])



        paymentList = paymentList.map(payment => {
            if (payment.Inquiry_details && payment.Inquiry_details.length > 0) {
                payment.Inquiry_details.forEach(inquiry => {
                    if (inquiry.product_details && inquiry.product_details.length > 0) {
                        inquiry.product_details.forEach(product => {
                            if (product.structure) {
                                product.structure = Azure_Storage_Base_Url + product.structure;
                            }
                        });
                    }
                });
            }
            return payment;
        });

        res.status(200).json({
            success: true,
            message: "Payment Display Successfully",
            data: paymentList
        })

    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
}


module.exports = {
    insertPayment: [verifyToken, insertPayment],
    displayList: [verifyToken, displayList],
    allPaymentList: [verifyToken, allPaymentList],
    verifyAccessToken
}