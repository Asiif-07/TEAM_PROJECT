import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        trim:true
    }
},{timestamps:true})



const BlogCatogery = mongoose.model("BlogCatogery", blogCategorySchema)

export default BlogCatogery;