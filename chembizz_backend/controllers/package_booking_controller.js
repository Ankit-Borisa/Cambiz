const mongoose = require("mongoose");
const package_booking_schema = require("../models/package_booking");
const Company = require('../models/company');
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");





const createPackageBooking = async (req, res) => {
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

        let { plan_id, transaction_id, package_feature, package_days, payment_mode, payment_ammout, package_name, payment_status, payment_id } = req.body

        let newData = new package_booking_schema({
            company_id: decodedToken.companyId,
            plan_id,
            transaction_id,
            payment_status: 'paid',
            payment_mode,

        });

        let result = await newData.save();
        

        await Company.findOneAndUpdate({ _id: decodedToken.companyId }, { $set: { membership_status: "paid" } }, { new: true })

        res.status(200).json({
            success: true,
            message: "Package Booking Successfully",
            data: result
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


// const display = async (req, res) => {
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

//         // Use aggregate to join data from multiple collections
//         let displayData = await package_booking_schema.aggregate([
//             {
//                 $match: { company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
//             },
//             {
//                 $lookup: {
//                     from: 'membership_plans',
//                     localField: 'plan_id',
//                     foreignField: '_id',
//                     as: 'plan_details',
//                     pipeline: [
//                         {
//                             $lookup: {
//                                 from: "membership_features",
//                                 localField: "membership_feature_id.membership_id",
//                                 foreignField: "_id",
//                                 as: "membership_feature_details"
//                             }
//                         },
//                     ]
//                 }
//             },

//         ]);

//         res.status(200).json({
//             success: true,
//             message: "Package Booking Find Successfully",
//             data: displayData
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };

const display = async (req, res) => {
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

        // Aggregate to get counts and data
        let displayData = await package_booking_schema.aggregate([
            {
                $match: { company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
            },
            {
                $facet: {
                    // Count sent inquiries
                    sentInquiriesCount: [
                        {
                            $lookup: {
                                from: 'inquiries', // Name of the Inquiry collection
                                let: { companyId: "$company_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$buyer_company_id", "$$companyId"] },
                                                    { $eq: ["$status", "pending"] }
                                                ]
                                            }
                                        }
                                    },
                                    { $count: "totalSentInquiries" }
                                ],
                                as: 'sent_inquiries'
                            }
                        },
                        {
                            $project: {
                                totalSentInquiries: { $arrayElemAt: ["$sent_inquiries.totalSentInquiries", 0] }
                            }
                        }
                    ],
                    // Count received inquiries
                    receiverInquiriesCount: [
                        {
                            $lookup: {
                                from: 'inquiries', // Name of the Inquiry collection
                                let: { companyId: "$company_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$seller_company_id", "$$companyId"]
                                            }
                                        }
                                    },
                                    { $count: "totalReceivedInquiries" }
                                ],
                                as: 'received_inquiries'
                            }
                        },
                        {
                            $project: {
                                totalReceivedInquiries: { $arrayElemAt: ["$received_inquiries.totalReceivedInquiries", 0] }
                            }
                        }
                    ],
                    // Count approved inquiries
                    approvedInquiriesCount: [
                        {
                            $lookup: {
                                from: 'inquiries', // Name of the Inquiry collection
                                let: { companyId: "$company_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$buyer_company_id", "$$companyId"] },
                                                    { $eq: ["$status", "approved"] }
                                                ]
                                            }
                                        }
                                    },
                                    { $count: "totalApprovedInquiries" }
                                ],
                                as: 'approved_inquiries'
                            }
                        },
                        {
                            $project: {
                                totalApprovedInquiries: { $arrayElemAt: ["$approved_inquiries.totalApprovedInquiries", 0] }
                            }
                        }
                    ],
                    // Package booking data
                    packageBookingData: [
                        {
                            $lookup: {
                                from: 'membership_plans',
                                localField: 'plan_id',
                                foreignField: '_id',
                                as: 'plan_details',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "membership_features",
                                            localField: "membership_feature_id.membership_id",
                                            foreignField: "_id",
                                            as: "membership_feature_details"
                                        }
                                    },
                                ]
                            }
                        },
                    ]
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Package Booking Find Successfully",
            data: displayData[0].packageBookingData,
            sentInquiries: displayData[0].sentInquiriesCount?.[0]?.totalSentInquiries || 0,
            receivedInquiries: displayData[0].receiverInquiriesCount?.[0]?.totalReceivedInquiries || 0,
            approvedInquiries: displayData[0].approvedInquiriesCount?.[0]?.totalApprovedInquiries || 0,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};





const displayById = async (req, res) => {
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

        // Use aggregate to join data from multiple collections
        let displayData = await package_booking_schema.aggregate([
            {
                $match: { company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
            },
            {
                $lookup: {
                    from: 'membership_plans',
                    localField: 'plan_id',
                    foreignField: '_id',
                    as: 'plan_details',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'membership_features',
                                localField: 'membership_feature_id',
                                foreignField: '_id',
                                as: 'membership_feature_details',
                            }
                        }
                    ]
                }
            },
        ]);

        res.status(200).json({
            success: true,
            message: "Package Booking Find Successfully",
            data: displayData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const showRemainingDays = async (req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]; 

        const decodedToken = verifyAccessToken(token); 

        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Only one active plan should exist per company.
        // When a new package is purchased, all previous packages are marked inactive.

        const packageData = await package_booking_schema.findOne({
            company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            status: "active"
        }).populate('plan_id');

        if (!packageData || !packageData.plan_id) {
            return res.status(404).json({ success: false, message: 'No active package found for this company' });
        }

        const companyPlan = packageData.plan_id;
        const totalPlanDays = companyPlan.plan_days;
        const companyDayCount = packageData.daysCount;

        const remainingDays = totalPlanDays - companyDayCount;
        const planName= companyPlan.plan_name;

        // If the remaining days are greater than zero, show the user their remaining time.
        // Otherwise, redirect them to the payment page.
        // If success is false in the response, also redirect to the payment page.

        return res.status(200).json({ success: true, remainingDays: remainingDays,planName });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    createPackageBooking: [verifyToken, createPackageBooking],
    displayById: [verifyToken, displayById],
    display: [verifyToken, display],
    showRemainingDays: [verifyToken,showRemainingDays],
    verifyAccessToken
}
