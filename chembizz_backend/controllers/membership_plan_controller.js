const mongoose = require("mongoose");
const plan_schema = require("../models/membership_plan_schema");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");
const Company = require("../models/company");






const add_plan = async (req, res) => {
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

        const plan_namedata = {
            plan_name: req.body.plan_name,
            plan_days: req.body.plan_days,
            plan_original_price: req.body.plan_original_price,
            plan_selling_price: req.body.plan_selling_price,
            membership_feature_id: req.body.membership_feature_id.membership_id,
            membership_feature_id: req.body.membership_feature_id.membership_feature_status,
            contact_limit: req.body.contact_limit,
            sequence: req.body.sequence,
            catalog_limit: req.body.catalog_limit
        }
        console.log(plan_namedata);
        //     let checkExist = await membership_feature_schema.aggregate([
        //      {
        //          $match: {
        //              me
        //          }
        //      }
        //     ]);
        //     if (checkExist.length > 0) {
        //        return res.status(200).json({ isSuccess: true, status: 1, data: [], message: "feature not exist" })
        //    }
        const plan_name_data = new plan_schema(req.body);
        const plan_name = await plan_name_data.save();

        res.status(200).json({
            success: true,
            message: "membership plan added successfully",
            data: plan_name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}



const display_plan = async (req, res) => {
    try {
        const plan_name = await plan_schema.aggregate([
            {
                $lookup: {
                    from: "membership_features",
                    localField: "membership_feature_id.membership_id",
                    foreignField: "_id",
                    as: "membership_feature_name"
                }
            },
            {
                $sort: { sequence: 1 }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "display membership plan",
            data: plan_name
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const display_plan_with_id = async (req, res) => {
    try {
        const planId = req.params.planId;
        // console.log(id);

        const display_plan_with_id = await plan_schema.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(planId) }
            },
            {
                $lookup: {
                    from: "membership_features",
                    localField: "membership_feature_id.membership_id",
                    foreignField: "_id",
                    as: "membership_feature_name"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Display membership plan",
            data: display_plan_with_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};





const update_plan = async (req, res) => {
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

        const plan_name_id = req.params.plan_name_id;

        const plan_namedata = {
            plan_name: req.body.plan_name,
            plan_days: req.body.plan_days,
            plan_original_price: req.body.plan_original_price,
            plan_selling_price: req.body.plan_selling_price,
            membership_feature_id: req.body.membership_feature_id,
            sequence: req.body.sequence,
            catalog_limit: req.body.catalog_limit
        }
        const plan_name_data = await plan_schema.findByIdAndUpdate({ _id: plan_name_id }, plan_namedata, { new: true });
        res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: plan_name_data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const update_membership_feature_status = async (req, res) => {
    try {
        const membership_plan_id = req.params.membership_plan_id;
        const membership_feature_id = req.params.membership_feature_id;
        const membership_feature_status = req.body.membership_feature_status;

        console.log('membership_plan_id:', membership_plan_id);
        console.log('membership_feature_id:', membership_feature_id);
        console.log('membership_feature_status:', membership_feature_status);


        const membership_plan_update_data = await plan_schema.updateOne(
            { _id: membership_plan_id, 'membership_feature_id._id': req.params.membership_feature_id },
            { $set: { 'membership_feature_id.$.membership_feature_status': req.body.membership_feature_status } }
        );
        res.status(200).json({
            success: true,
            message: "update status",
            data: membership_plan_update_data
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const delete_membership_plan = async (req, res) => {
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
        const planId = req.params.planId;
        if (!planId) {
            return res.status(401).json({
                success: false,
                message: "Membership plan not found"
            })
        }
        const deletedPlan = await plan_schema.findOneAndDelete(planId);
        res.status(200).json({
            success: true,
            message: "Membership plan deleted successfully",
            data: deletedPlan
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const update_status = async (req, res) => {
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

        const updateData = {
            membership_status: "expired"
        }
        const status_data = await Company.findOneAndUpdate({ _id: decodedToken.companyId }, updateData, { new: true });
        res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: status_data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    add_plan: [verifyToken, add_plan],
    display_plan,
    display_plan_with_id,
    update_plan: [verifyToken, update_plan],
    update_membership_feature_status,
    delete_membership_plan: [verifyToken, delete_membership_plan],
    update_status: [verifyToken, update_status],
    verifyAccessToken
}