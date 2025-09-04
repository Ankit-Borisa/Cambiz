const mongoose = require("mongoose");
const Request_demo = require("../models/request_demo");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");



const newRequestDemo = async (req, res) => {
    try {

        let { company_name, contact_person_name, contact_number, contact_date, contact_time } = req.body

        let newRequest = new Request_demo({
            company_name,
            contact_date,
            contact_time,
            contact_number,
            contact_person_name
        });

        let result = await newRequest.save();

        res.status(200).json({
            success: true,
            message: "New Request Demo Insert Successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateRequestDemo = async (req, res) => {
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

        let updateData = {
            status: req.body.status
        }
        let updatedRequest = await Request_demo.findOneAndUpdate({ _id: id }, updateData, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: "Request Demo not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Request Demo Updated Successfully",
            data: updatedRequest
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllRequestDemos = async (req, res) => {
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

        let requestDemos = await Request_demo.find();
        res.status(200).json({
            success: true,
            data: requestDemos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getRequestDemoById = async (req, res) => {
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

        let id = req.params._id

        let requestDemo = await Request_demo.findById(id);

        if (!requestDemo) {
            return res.status(404).json({
                success: false,
                message: "Request Demo not found"
            });
        }

        res.status(200).json({
            success: true,
            data: requestDemo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    newRequestDemo,
    updateRequestDemo: [verifyToken, updateRequestDemo],
    getAllRequestDemos: [verifyToken, getAllRequestDemos],
    getRequestDemoById: [verifyToken, getRequestDemoById],
    verifyAccessToken
}