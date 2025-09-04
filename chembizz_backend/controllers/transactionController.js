const mongoose = require("mongoose");
const Payment = require("../models/transaction");
const axios = require("axios");
const uniqid = require("uniqid");
const sha256 = require("sha256");
const paymentSchema = require("../models/payment");
const package_booking_schema = require("../models/package_booking");

const { MERCHANT_ID } = process.env;
const { SALT_KEY } = process.env;

const { Environment } = process.env;

const SALT_KEY_INDEX = 1;
const HOST_URI = "https://api.phonepe.com/apis/hermes";
const PAY_URI = "/pg/v1/pay";

const base_front_url = Environment === "Production" ? "https://www.chembizz.in" : "http://localhost:5173";


const getISTTimeString = () => {
    const date = new Date();

    // Get the UTC time in milliseconds, then add the IST offset (5 hours 30 minutes = 330 minutes)
    const istOffsetInMinutes = 330;
    const istTime = new Date(date.getTime() + istOffsetInMinutes * 60000);

    return istTime;
  };





exports.initiate_payment = async (req, res) => {
    try {
        const {
            MERCHANT_USER_ID,
            amount,
            link,
            emailid,
            inquiry_id,
            plan_id
        } = req.body;

        const merchantTransactionId = uniqid();

        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: MERCHANT_USER_ID,
            amount: amount * 100, // paisa
            redirectUrl: `${base_front_url}/company/payment-status/${merchantTransactionId}`,
            redirectMode: "REDIRECT",
            email: emailid,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
        const base64Payload = bufferObj.toString("base64");

        const xVerify =
            sha256(base64Payload + PAY_URI + SALT_KEY) + "###" + SALT_KEY_INDEX;

        const options = {
            method: "post",
            url: `${HOST_URI}${PAY_URI}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": xVerify,
            },
            data: {
                request: base64Payload,
            },
        };

        const paymentData = await paymentSchema.create({
            user_id: MERCHANT_USER_ID,
            trnsaction_id: merchantTransactionId,
            status: "pending",
            paid_amount: amount,
            inquiry_id,
            plan_id
        });

        // here we make a document for  package booking document with status inactive

        const indianTime = getISTTimeString()

        const companyNewPackage = new package_booking_schema({
            company_id: MERCHANT_USER_ID,
            plan_id,
            transaction_id:merchantTransactionId,
            booking_date:indianTime,
            daysCount:0,
            status:'inactive',
            payment_mode:"Online",
            payment_status:'unpaid'
        });

        await companyNewPackage.save();
         


        try {
            const response = await axios.request(options);
            console.log(response.data);
            res.status(200).json({
                success: true,
                message: "payment initiated",
                data: {
                    url: response.data.data.instrumentResponse.redirectInfo.url,
                    merchantTransactionId: merchantTransactionId,
                },
            });
        } catch (error) {
            await paymentSchema.findOneAndUpdate(
                { _id: paymentData._id },
                { $set: { status: "failed" } }
            );
            console.error(error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const { merchantTransactionId } = req.query;

        const xVerify =
            sha256(
                `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` +
                SALT_KEY
            ) +
            "###" +
            SALT_KEY_INDEX;

        const options = {
            method: "get",
            url: `${HOST_URI}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-MERCHANT-ID": MERCHANT_ID,
                "X-VERIFY": xVerify,
            },
        };

        try {
            const response = await axios.request(options);
            console.log("Payment status response:", response.data);
            console.log("payment mode", response.data?.data?.paymentInstrument?.type)

            if (response.data?.data?.responseCode=='SUCCESS') {
                const updateResult = await paymentSchema.findOneAndUpdate(
                    { trnsaction_id: merchantTransactionId.toString() },
                    { $set: { status: "success" } },
                    { new: true } // Return the updated document
                );

                // here we update the pakage booking with active and all there are become expaired .

                const bookedPackege= await package_booking_schema.findOne({transaction_id:merchantTransactionId});

                const companyId= bookedPackege?.company_id;

                if (!bookedPackege) {
                    console.error("❌ No package found for transaction:", merchantTransactionId);
                }

                console.log(".....compnay id",companyId);

                await package_booking_schema.updateMany(
                    { company_id: companyId, transaction_id:{$ne:merchantTransactionId} },
                    { $set: { status: 'expired' } }
                );

                bookedPackege.status='active';
                bookedPackege.payment_status='paid';
                bookedPackege.payment_mode=response.data?.data?.paymentInstrument?.type || "online"
                await bookedPackege.save();


                console.log("Update result (success):", updateResult);
            } else {
                const updateResult = await paymentSchema.findOneAndUpdate(
                    { trnsaction_id: merchantTransactionId.toString() },
                    { $set: { status: "failed" } },
                    { new: true } // Return the updated document
                );

                // here we delete the inactive status package booking document .

                await package_booking_schema.findOneAndDelete({transaction_id:merchantTransactionId, status: 'inactive'});

                console.log("Update result (failure):", updateResult);
            }

            return res.send(response.data);
        } catch (error) {
            const updateResult = await paymentSchema.findOneAndUpdate(
                { trnsaction_id: merchantTransactionId.toString() },
                { $set: { status: "failed" } },
                { new: true } // Return the updated document
            );
            console.log("Update result (catch error):", updateResult);

            // here we delete the inactive status package booking document .

            await package_booking_schema.findOneAndDelete({transaction_id:merchantTransactionId, status: 'inactive'});


            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

