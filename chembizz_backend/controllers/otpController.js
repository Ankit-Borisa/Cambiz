const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const path = require('path');
const Company = require("../models/company");
const Otp = require("../models/otp")
const fs = require("fs")
require('dotenv').config()

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)




const sendOTPEmail = async (emailid, otp) => {
    const msg = {
        to: emailid,
        from: {
            email: '57rakesh17@gmail.com',
            name: 'OTP Verification For ChemBizZ'
        },
        subject: 'Your OTP for verification',
        text: `Your OTP is :${otp}`,
        html: `Your OTP is :${otp}`,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.response.body);
        throw new Error('Error sending OTP email');
    }
};


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



// const sendOtp = async (req, res) => {
//     try {

//         let { emailid } = req.body

//         let generatedOTP = generateOTP()

//         await sendOTPEmail(emailid, generatedOTP);

//         let data = await Otp.findOne({ emailid: emailid })

//         if (data) {

//             let otpExitsData = await Otp.findOneAndUpdate(
//                 { emailid: emailid },
//                 { $set: { otp_value: generatedOTP, otp_for: 'fp' } },
//                 { new: true }
//             );

//             console.log(otpExitsData)
//         } else {

//             let otpData = new Otp({
//                 emailid: emailid,
//                 otp_value: generatedOTP,
//                 otp_for: 'registration'
//             });

//             await otpData.save()

//             console.log(otpData);
//         }

//         res.status(200).json({
//             success: true,
//             message: "Otp Send Successfully"
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

const sendOtp = async (req, res) => {
    try {
        let { emailid } = req.body;

        // Check if the email exists in the database before sending OTP
        let data = await Otp.findOne({ emailid: emailid });

        if (!data) {
            // If email is not found during forgot password, send "Email not found" message
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        // Generate OTP and send it to the email
        let generatedOTP = generateOTP();
        await sendOTPEmail(emailid, generatedOTP);

        // Update OTP data if the email exists
        await Otp.findOneAndUpdate(
            { emailid: emailid },
            { $set: { otp_value: generatedOTP, otp_for: 'fp' } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const sendRegistionOtp = async (req, res) => {
    try {
        let { emailid } = req.body;

        let generatedOTP = generateOTP();
        await sendOTPEmail(emailid, generatedOTP);

        // Update OTP data if the email exists
        // await Otp.findOneAndUpdate(
        //     { emailid: emailid },
        //     { $set: { otp_value: generatedOTP, otp_for: 'registration' } },
        //     { new: true }
        // );
        let otp = await Otp.create({
            emailid: emailid,
            otp_value: generatedOTP,
            otp_for: 'registration'
        });

        console.log(otp)

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verify_otp = async (req, res) => {
    try {
        let { emailid, otp_value } = req.body;
        let otpData = await Otp.findOne({ emailid });

        console.log(otpData)

        if (!otpData) {
            res.status(400).json({ succuss: false, message: "User not found!" })
        }

        if (otp_value !== otpData.otp_value) {
            res.status(400).json({ succuss: false, message: "invalid otp" })
        } else {
            await Otp.findOneAndUpdate({ emailid: emailid }, { $set: { otp_value: null, otp_for: 'verification' } })
            res.status(200).json({ succuss: true, message: "otp verify succussfully" })
        }
    } catch (error) {
        res.status(500).json({ succuss: false, message: error.message })
    }
}






const resend_otp = async (req, res) => {
    try {
        let { emailid } = req.body;

        if (!emailid) {
            return res.status(400).json({
                succuss: false,
                message: "Email is required",
            });
        }
        let otp = generateOTP();
        await sendOTPEmail(emailid, otp);
        await Otp.findOneAndUpdate({ emailid }, { otp_value: otp });
        res.status(200).json({
            success: true,
            message: "otp resend succussfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error",
        });
    }
}


module.exports = {
    sendOtp,
    sendRegistionOtp,
    verify_otp,
    resend_otp,
    sendOTPEmail,
    generateOTP
}