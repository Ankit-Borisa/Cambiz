const mongoose = require('mongoose')

const blog_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    photo: {
        type: String
    }
},
    {
        timestamps: true
    }
);

const blog_Schema = new mongoose.model("blog", blog_schema);

module.exports = blog_Schema
