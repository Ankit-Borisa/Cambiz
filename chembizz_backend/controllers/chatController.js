const mongoose = require("mongoose");
const Chat = require("../models/chat");
const Negotation = require("../models/negotation");
const Inquiry = require("../models/inquiry")
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");
const Conversation = require("../models/conversation.model");
const { getReceiverSocketId, io } = require("../socket/socket");
const inquiry_status = require("../models/inquiry_status");
const Notification = require('../models/notification');
const Product = require("../models/productModel");
const Company = require("../models/company");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl");
const salesInvoice = require("../models/salesInvoice");



const insertChat = async (req, res) => {
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

        const senderId = decodedToken.companyId;
        let { inquiryId, message, inco_terms, receiverId, quantity, quantity_type, final_price, payment_terms, delivery_time, request_status, status_change_by } = req.body;

        const inquiryStatus = await Inquiry.findOne({ _id: inquiryId })


        let chatData = new Chat({
            inquiryId,
            senderId: senderId,
            message,
            receiverId,
            quantity,
            quantity_type,
            final_price,
            inco_terms,
            payment_terms,
            request_status,
            delivery_time,
            status_change_by
        });

        // await chatData.save()

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', chatData)
        }


        // Conditionally add negotiation data if quantity is not empty
        if (quantity && quantity.length !== 0) {

            let existingNegotiations = await Negotation.findOne({ inquiryId: inquiryId });

            if (existingNegotiations) {

                // let existingNegotiations = await Negotation.find({ inquiryId: inquiryId });
                let check_status = existingNegotiations.request_status;

                if (check_status === 'pending' || check_status === 'approved') {

                    return res.status(400).json({
                        success: false,
                        message: "you can't request for negotiation"
                    })
                } else {
                    let negotiationData1 = new Negotation({
                        inquiryId,
                        senderId,
                        receiverId,
                        message,
                        quantity,
                        quantity_type,
                        final_price,
                        inco_terms,
                        request_status,
                        payment_terms,
                        delivery_time,
                        status_change_by
                    });
                    // await Inquiry.findByIdAndUpdate(inquiryId, { status: "negotiation" });
                    await negotiationData1.save();

                    let inquiryData = await Inquiry.findOne({ _id: inquiryId });
                    let productIds = inquiryData.product_id;
                    let buyer_id = inquiryData.buyer_company_id;
                    let seller_id = inquiryData.seller_company_id;

                    let product_name = await Product.findOne({ _id: productIds })

                    let buyer_company_name = await Company.findOne({ _id: buyer_id })

                    let seller_company_name = await Company.findOne({ _id: seller_id })

                    if (senderId == inquiryData.buyer_company_id) {
                        const notificationData = await Notification.create({
                            title: "Negotiation Request",
                            company_id: inquiryData.seller_company_id,
                            inquiry_id: inquiryId,
                            message: `${buyer_company_name.company_name} Wants to negotiation on inquiry of ${product_name.name_of_chemical}`
                        });


                        // Emit live notification to the seller
                        const sellerSocketId = getReceiverSocketId(inquiryData.seller_company_id);
                        if (sellerSocketId) {
                            io.to(sellerSocketId).emit('newNotification', notificationData);
                        }
                    } else if (senderId == inquiryData.seller_company_id) {
                        const notificationData = await Notification.create({
                            title: "Negotiation Request",
                            company_id: inquiryData.buyer_company_id,
                            inquiry_id: inquiryId,
                            message: `${seller_company_name.company_name} Wants to negotiation on inquiry of ${product_name.name_of_chemical}`
                        });

                        // Emit live notification to the buyer
                        const buyerSocketId = getReceiverSocketId(inquiryData.buyer_company_id);
                        if (buyerSocketId) {
                            io.to(buyerSocketId).emit('newNotification', notificationData);
                        }

                    }
                }
            } else {
                let negotiationData1 = new Negotation({
                    inquiryId,
                    senderId,
                    receiverId,
                    message,
                    quantity,
                    quantity_type,
                    inco_terms,
                    final_price,
                    payment_terms,
                    request_status,
                    delivery_time,
                    status_change_by
                });

                await Inquiry.findByIdAndUpdate(inquiryId, { status: "negotiation" });


                let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Negotiation' }] } }, { new: true });
                await negotiationData1.save();

                const inquiryStatusSocket = getReceiverSocketId(senderId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket) {
                    io.to(inquiryStatusSocket).emit('statusChange', updateData);
                }
                const inquiryStatusSocket1 = getReceiverSocketId(receiverId); // Implement this function to get the seller's socket ID
                if (inquiryStatusSocket1) {
                    io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                }

              
                let inquiryData = await Inquiry.findOne({ _id: inquiryId });
                let productIds = inquiryData.product_id;
                let buyer_id = inquiryData.buyer_company_id;
                let seller_id = inquiryData.seller_company_id;

                let product_name = await Product.findOne({ _id: productIds })

                let buyer_company_name = await Company.findOne({ _id: buyer_id })

                let seller_company_name = await Company.findOne({ _id: seller_id })

                if (senderId == inquiryData.buyer_company_id) {
                    const notificationData = await Notification.create({
                        title: "Negotiation Request",
                        company_id: inquiryData.seller_company_id,
                        inquiry_id: inquiryId,
                        message: `${buyer_company_name.company_name} Wants to negotiation on inquiry of ${product_name.name_of_chemical}`
                    });


                    // Emit live notification to the seller
                    const sellerSocketId = getReceiverSocketId(inquiryData.seller_company_id);
                    if (sellerSocketId) {
                        io.to(sellerSocketId).emit('newNotification', notificationData);
                    }
                 

                } else if (senderId == inquiryData.seller_company_id) {
                    const notificationData = await Notification.create({
                        title: "Negotiation Request",
                        company_id: inquiryData.buyer_company_id,
                        inquiry_id: inquiryId,
                        message: `${seller_company_name.company_name} Wants to negotiation on inquiry of ${product_name.name_of_chemical}`
                    });

                    // Emit live notification to the buyer
                    const buyerSocketId = getReceiverSocketId(inquiryData.buyer_company_id);
                    if (buyerSocketId) {
                        io.to(buyerSocketId).emit('newNotification', notificationData);
                    }


                }
            }
        }
        await chatData.save()
        return res.status(200).json({
            success: true,
            message: "Chat inserted successfully",
            data: chatData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const displayChatByInquiry = async (req, res) => {
    try {
        let inquiryId = req.params.inquiryId;
        if (!inquiryId) {
            return res.status(400).json({
                success: false,
                message: "Bad request: Inquiry ID is required"
            });
        }

        let data = await Chat.aggregate([
            {
                $match: { inquiryId: new mongoose.Types.ObjectId(inquiryId) }
            },
            {
                $lookup: {
                    from: "inquiries",
                    localField: "inquiryId",
                    foreignField: "_id",
                    as: "inquiryDetails"
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: 'senderId',
                    foreignField: 'company_id',
                    as: 'sender_other_info'
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiverDetails"
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: 'receiverId',
                    foreignField: 'company_id',
                    as: 'receiver_other_info'
                }
            },
            {
                $project: {
                    _id: 1,
                    inquiryId: 1,
                    senderId: 1,
                    receiverId: 1,
                    message: 1,
                    datetime: 1,
                    quantity: 1,
                    quantity_type: 1,
                    inco_terms: 1,
                    final_price: 1,
                    payment_terms: 1,
                    request_status: 1,
                    delivery_time: 1,
                    status_change_by: 1,
                    inquiryDetails: 1,
                    'senderDetails._id': 1,
                    'senderDetails.company_name': 1,
                    'sender_other_info.logo': 1,
                    'receiverDetails._id': 1,
                    'receiverDetails.company_name': 1,
                    'receiver_other_info.logo': 1

                }
            }
        ]);

        data.forEach(chat => {
            chat.sender_other_info.forEach(info => {
                if (info.logo) {
                    info.logo = Azure_Storage_Base_Url + info.logo;
                }
            });

            chat.receiver_other_info.forEach(info => {
                if (info.logo) {
                    info.logo = Azure_Storage_Base_Url + info.logo;
                }
            });

            chat.inquiryDetails.forEach(inquiry => {
                if (inquiry.COA) {
                    inquiry.COA = Azure_Storage_Base_Url + inquiry.COA;
                }
            });
        });

        res.status(200).json({
            success: true,
            message: "Inquiry and Chat details found successfully",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// const updateStatus = async (req, res) => {
//     try {
//         let chatId = req.params.chatId
//         let negotiationId = req.params.negotiationId
//         let request_status = req.body.request_status
//         // Extract necessary data from the request body
//         const { receiverId, senderId, inquiryId } = req.body;

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

//         if (!chatId && !negotiationId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Either chatId or negotiationId is required"
//             });
//         }

//         let findData = await Negotation.find({ inquiryId: inquiryId, request_status: 'pending' })

//         let negotationStatus = findData[0].request_status;

//         if (negotationStatus === 'pending') {
//             if (decodedToken.companyId === senderId && request_status === 'cancel') {
//                 if (chatId) {
//                     await Chat.findByIdAndUpdate(chatId, { request_status: request_status, status_change_by: decodedToken.companyId });
//                 }


//                 if (negotiationId) {
//                     await Negotation.findByIdAndUpdate(negotiationId, { request_status: request_status, status_change_by: decodedToken.companyId });
//                 }
//                 res.status(200).json({
//                     success: true,
//                     message: "Status updated successfully"
//                 });
//             } else {
//                 if (decodedToken.companyId === receiverId && request_status === 'approved' || request_status === 'denied') {
//                     if (chatId) {
//                         await Chat.findByIdAndUpdate(chatId, { request_status: request_status, status_change_by: decodedToken.companyId });
//                     }

//                     if (negotiationId && request_status === "approved") {
//                         await Negotation.findByIdAndUpdate(negotiationId, { request_status: request_status, status_change_by: decodedToken.companyId });

//                         await Inquiry.findByIdAndUpdate(inquiryId, { status: "deal done" });
//                     }
//                     res.status(200).json({
//                         success: true,
//                         message: "Status updated successfully"
//                     });
//                 } else {
//                     res.status(400).json({
//                         success: true,
//                         message: "user not authenticated"
//                     });
//                 }
//             }
//         } else {
//             res.status(400).json({
//                 success: true,
//                 message: "you can not change now"
//             })
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };


const updateStatus = async (req, res) => {
    try {
        const { negotiationId } = req.params;
        const { chatId, request_status, receiverId, senderId, inquiryId } = req.body;

        if (!chatId && !negotiationId) {
            return res.status(400).json({
                success: false,
                message: "Either chatId or negotiationId is required"
            });
        }

        if (!request_status) {
            return res.status(400).json({
                success: false,
                message: "Request status is required"
            });
        }

        let inquiryData = await Inquiry.findOne({ _id: inquiryId });
        let buyerCompanyid = inquiryData.buyer_company_id;
        let sellerCompanyid = inquiryData.seller_company_id;
        let productId = inquiryData.product_id

        const buyer_company_name = await Company.findOne({ _id: buyerCompanyid })
        const seller_company_name = await Company.findOne({ _id: sellerCompanyid })
        const product_name = await Product.findOne({ _id: productId })

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

        let findData = await Negotation.find({ inquiryId: inquiryId, request_status: 'pending' });


        if (!findData.length) {
            return res.status(400).json({
                success: false,
                message: "No pending negotiation found for the given inquiryId"
            });
        }

        let negotationStatus = findData[0].request_status;

        if (negotationStatus === 'pending') {
            if (decodedToken.companyId == senderId && request_status === 'cancel') {
                if (chatId) {
                    await Chat.findByIdAndUpdate(chatId, { request_status: request_status, status_change_by: decodedToken.companyId });
                }

                if (negotiationId) {
                    await Negotation.findByIdAndUpdate(negotiationId, { request_status: request_status, status_change_by: decodedToken.companyId });
                }

                let notificationData = await Notification.create({
                    title: `Negotation Status ${request_status}`,
                    company_id: receiverId,
                    inquiry_id: inquiryId,
                    message: `${buyer_company_name.company_name} the negotiation of ${product_name.name_of_chemical} inquiry ${request_status}`
                })

                const sellerSocketId = getReceiverSocketId(receiverId); // Implement this function to get the seller's socket ID
                if (sellerSocketId) {
                    io.to(sellerSocketId).emit('newNotification', notificationData);
                }

                io.to(getReceiverSocketId(senderId)).emit('negotiationStatus', {
                    inquiryId,
                    request_status,
                    chatId,
                    negotiationId,
                    status_change_by: decodedToken.companyId
                });

                console.log("negotiation status :", request_status)
                console.log("sender...." + senderId)

                io.to(getReceiverSocketId(receiverId)).emit('negotiationStatus', {
                    inquiryId,
                    request_status,
                    chatId,
                    negotiationId,
                    status_change_by: decodedToken.companyId
                });

                console.log("negotiation status :", request_status)

                console.log("receiver...." + receiverId)

                return res.status(200).json({
                    success: true,
                    message: "Status updated successfully"
                });
            } else if (decodedToken.companyId == receiverId && (request_status === 'approved' || request_status === 'denied')) {
                if (chatId) {
                    await Chat.findByIdAndUpdate(chatId, { request_status: request_status, status_change_by: decodedToken.companyId });
                }

                if (negotiationId) {
                    await Negotation.findByIdAndUpdate(negotiationId, { request_status: request_status, status_change_by: decodedToken.companyId });

                    let notificationData = await Notification.create({
                        title: `Negotation Status ${request_status}`,
                        company_id: senderId,
                        inquiry_id: inquiryId,
                        message: `${seller_company_name.company_name} the negotiation of ${product_name.name_of_chemical} inquiry ${request_status}`
                    })

                    const buyerSocketId = getReceiverSocketId(senderId); // Implement this function to get the seller's socket ID
                    if (buyerSocketId) {
                        io.to(buyerSocketId).emit('newNotification', notificationData);
                    }

                    if (request_status === "approved") {
                        await Inquiry.findByIdAndUpdate(inquiryId, { status: "deal done" });
                        let updateData = await inquiry_status.findOneAndUpdate({ inquiry_id: inquiryId }, { $push: { inquiry_status_value: [{ status: 'Deal' }] } }, { new: true });

                        const inquiryStatusSocket = getReceiverSocketId(receiverId); // Implement this function to get the seller's socket ID
                        if (inquiryStatusSocket) {
                            io.to(inquiryStatusSocket).emit('statusChange', updateData);
                        }

                        const inquiryStatusSocket1 = getReceiverSocketId(senderId); // Implement this function to get the seller's socket ID
                        if (inquiryStatusSocket1) {
                            io.to(inquiryStatusSocket1).emit('statusChange', updateData);
                        }

                    }
                }
                io.to(getReceiverSocketId(senderId)).emit('negotiationStatus', {
                    inquiryId,
                    request_status,
                    chatId,
                    negotiationId,
                    status_change_by: decodedToken.companyId
                });

                console.log("negotiation status :", request_status)
                console.log("sender...." + senderId)

                io.to(getReceiverSocketId(receiverId)).emit('negotiationStatus', {
                    inquiryId,
                    request_status,
                    chatId,
                    negotiationId,
                    status_change_by: decodedToken.companyId
                });

                console.log("negotiation status :", request_status)

                console.log("receiver...." + receiverId)

                return res.status(200).json({
                    success: true,
                    message: "Status updated successfully"
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "User not authenticated or invalid request status"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "You cannot change the status now"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const negotationDisplayByCompany = async (req, res) => {
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

        const inquiryId = req.params.inquiryId;
        if (!inquiryId) {
            return res.status(400).json({
                success: false,
                message: "Bad request: Inquiry ID is required"
            });
        }

        const displayNegotationData = await Negotation.aggregate([
            {
                $match: { inquiryId: new mongoose.Types.ObjectId(inquiryId) }
            },
            {
                $lookup: {
                    from: "inquiries",
                    localField: "inquiryId",
                    foreignField: "_id",
                    as: "inquiryDetails"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "inquiryDetails.product_id",
                    foreignField: "_id",
                    as: "product_details"
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: 'senderId',
                    foreignField: 'company_id',
                    as: 'sender_other_info'
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiverDetails"
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: 'receiverId',
                    foreignField: 'company_id',
                    as: 'receiver_other_info'
                }
            },
            {
                $sort: { datetime: -1 } // Sort by datetime in ascending order
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 1,
                    inquiryId: 1,
                    senderId: 1,
                    receiverId: 1,
                    message: 1,
                    datetime: 1,
                    quantity: 1,
                    quantity_type: 1,
                    request_status: 1,
                    inco_terms: 1,
                    final_price: 1,
                    payment_terms: 1,
                    delivery_time: 1,
                    status_change_by: 1,
                    inquiryDetails: { $arrayElemAt: ['$inquiryDetails', 0] },
                    product_details: { $arrayElemAt: ['$product_details', 0] },
                    'senderDetails._id': { $arrayElemAt: ['$senderDetails._id', 0] },
                    'senderDetails.company_name': { $arrayElemAt: ['$senderDetails.company_name', 0] },
                    'sender_other_info.logo': { $arrayElemAt: ['$sender_other_info.logo', 0] },
                    'receiverDetails._id': { $arrayElemAt: ['$receiverDetails._id', 0] },
                    'receiverDetails.company_name': { $arrayElemAt: ['$receiverDetails.company_name', 0] },
                    'receiver_other_info.logo': { $arrayElemAt: ['$receiver_other_info.logo', 0] }
                }
            }
        ]);

        displayNegotationData.forEach(chat => {
            chat.sender_other_info.forEach(info => {
                if (info.logo) {
                    info.logo = Azure_Storage_Base_Url + info.logo;
                }
            });

            chat.receiver_other_info.forEach(info => {
                if (info.logo) {
                    info.logo = Azure_Storage_Base_Url + info.logo;
                }
            });

            if (chat.inquiryDetails && chat.inquiryDetails.COA) {
                chat.inquiryDetails.COA = Azure_Storage_Base_Url + chat.inquiryDetails.COA;
            }
        });


        // adding gst in final price which is saved in salesInvoice

        const finalPriceValue = await salesInvoice.findOne({inquiry_id:inquiryId,invoice_type:"tax_invoice"});
        
        const finalPrice = finalPriceValue?.grand_total % 1 < 0.5 ? Math.floor(finalPriceValue?.grand_total) : Math.ceil(finalPriceValue?.grand_total) ;

        if(finalPrice){
            if(displayNegotationData.length){
                displayNegotationData[0].final_price = finalPrice
            }
            
        }        

        res.status(200).json({
            success: true,
            message: "Negotiation details found successfully",
            data: displayNegotationData.length ? displayNegotationData[0] : null
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const getMessages = async (req, res) => {
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

        // const tokenData = req.userdata;

        const { id } = req.params;
        
        const senderId = decodedToken.companyId;
        const receiverId = decodedToken.companyId;
    

        let messages = await Chat.find({ inquiryId: id })

        const senderSocketId = getReceiverSocketId(senderId);

        if (senderSocketId) {
            io.to(receiverSocketId).emit('displayMessage', messages)
        }
      

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('displayMessage', messages)
        }

      
        res.status(200).json({
            success: true,
            message: "Message Get Successfully",
            data: messages
        });

    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    insertChat: [verifyToken, insertChat],
    displayChatByInquiry,
    updateStatus: [verifyToken, updateStatus],
    getMessages: [verifyToken, getMessages],
    negotationDisplayByCompany: [verifyToken, negotationDisplayByCompany],
    verifyAccessToken
}