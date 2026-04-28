import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
        default:null
    },
    image:[{
        type:String
    }],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BlogCatogery",
        required:true
    },
    status:{
        type:String,
        enum:["draft", "published"],
        default:"draft",
    },
    tages:[{
        type:String
    }],
    views:{
        type:Number,
        default:0
    }
    
},{timestamps:true})

const Blog = mongoose.model("Blog", BlogSchema)

export default Blog;