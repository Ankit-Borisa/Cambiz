const mongoose = require("mongoose");
const blog_Schema = require("../models/blog_schema");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl");
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");

exports.createBlog = async (req, res) => {
    try {
        let { title, Description } = req.body

        if(!req.file){
            return res.status(400).json({message: "Please upload a file."})
        }

        let uploadResult = await uploadToAzureBlob(req.file);

        const uniqueFileName = uploadResult.uniqueFileName;

        let newData = new blog_Schema({
            title,
            Description,
            photo: uniqueFileName
        });

        let result = await newData.save();

        return res.status(200).json({
            success: true,
            message: "Blog Create Successfully",
            data: result
        })
    } catch (error) {

    }
}

exports.displayBlogs = async (req, res) => {
    try {
        let blogs = await blog_Schema.find();

        blogs = blogs.map(blog => ({
            ...blog._doc,
            photo: Azure_Storage_Base_Url + blog.photo
        }));

        return res.status(200).json({
            success: true,
            message: "Blog Display Successfully",
            data: blogs
        });



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve blogs",
            error: error.message
        });
    }
};

exports.displayBlogById = async (req, res) => {
    try {
        let blog = await blog_Schema.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        blog = {
            ...blog._doc,
            photo: Azure_Storage_Base_Url + blog.photo
        };

        return res.status(200).json({
            success: true,
            message: "Blog Display Successfully",
            data: blog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve blog",
            error: error.message
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        // let { title, Description } = req.body;

        let existBlog= await blog_Schema.findOne({_id:req.params.id});

        if(!existBlog){
            return res.status(404).json({message:"blog not found to update"})
        }


        let blog = await blog_Schema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );


        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (req.file) {

            let uploadResult = await uploadToAzureBlob(req.file);

            const uniqueFileName = uploadResult.uniqueFileName;

            const existBlogf = existBlog?.photo;

            console.log("receiving the blog photo file ....");

            if (existBlogf) {
                await deleteFromAzureBlob(existBlogf);
            } else {
                console.log("No previous coa to delete");
            }

            blog.photo = uniqueFileName;

            await blog.save(); // Save the updated blog to apply the photo update
        }

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update blog",
            error: error.message
        });
    }
};



exports.deleteBlog = async (req, res) => {
    try {
        let blog = await blog_Schema.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: error.message
        });
    }
};


