const mongoose = require("mongoose");
const return_order = require("../models/return_order");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");




const create_return_order = async (req, res) => {
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

        let { inquiry_id, seller_id, total_return_qty, total_return_amount, qty_type } = req.body

        let createReturnOrder = new return_order({
            inquiry_id,
            buyer_id: decodedToken.companyId,
            seller_id,
            total_return_qty,
            qty_type,
            total_return_amount
        });

        let result = await createReturnOrder.save();

        res.status(200).json({
            success: true,
            message: "Return Order Add Successfully",
            data: result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: true,
            message: "Internal Server Error"
        })
    }
}

const displayList = async (req, res) => {
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
        let token_id = decodedToken.companyId

        console.log("_id :", token_id)

        let request_type = req.params.request_type

        if (request_type === 'buyer') {

            const purchaseReturnOrderList = await return_order.aggregate([
                {
                    $match: { buyer_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'seller_id',
                        foreignField: '_id',
                        as: 'seller_details',
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details',
                        pipeline: [
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
                                    from: 'salesinvoices',
                                    localField: '_id',
                                    foreignField: 'inquiry_id',
                                    as: 'po_details',
                                }
                            },
                            {
                                $addFields: {
                                    po_details: {
                                        $filter: {
                                            input: '$po_details',
                                            as: 'po',
                                            cond: { $eq: ['$$po.invoice_type', 'po'] }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]);

            if (!purchaseReturnOrderList) {
                return res.status(200).json({
                    success: true,
                    messsge: "No purchase Return Order Available",
                    data: []
                })
            }

            res.status(200).json({
                success: true,
                message: "purchase Return Order List Display Successfully",
                data: purchaseReturnOrderList
            })

        } else if (request_type === 'seller') {
            const salesReturnOrderList = await return_order.aggregate([
                {
                    $match: { seller_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'buyer_id',
                        foreignField: '_id',
                        as: 'buyer_details',
                    }
                },
                {
                    $lookup: {
                        from: 'inquiries',
                        localField: 'inquiry_id',
                        foreignField: '_id',
                        as: 'inquiry_details',
                        pipeline: [
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
                                    from: 'salesinvoices',
                                    localField: '_id',
                                    foreignField: 'inquiry_id',
                                    as: 'po_details',
                                }
                            },
                            {
                                $addFields: {
                                    po_details: {
                                        $filter: {
                                            input: '$po_details',
                                            as: 'po',
                                            cond: { $eq: ['$$po.invoice_type', 'po'] }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ])

            if (!salesReturnOrderList) {
                return res.status(200).json({
                    success: true,
                    messsge: "No sales Return Order List Available",
                    data: []
                })
            }

            res.status(200).json({
                success: true,
                message: "sales Return Order List Display Successfully",
                data: salesReturnOrderList
            })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: true,
            message: "Internal Server Error"
        })
    }
}



module.exports = {
    create_return_order: [verifyToken, create_return_order],
    displayList: [verifyToken, displayList],
    verifyAccessToken
}