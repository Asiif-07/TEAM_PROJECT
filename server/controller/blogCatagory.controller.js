import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/CustomError.js";
import User from "../model/user.model.js";

const createBlogCategory = AsyncHandler(async (req, res, next)=>{
    const userId = req.userId;
    const {name, description} = req.body;


    const user = await User.findById(userId);

    if(!user){
        return next(new CustomError(404, "User not found"));
    }

    const blogCatagory = await blogCatagory.create({
        name,
        description,
        userId
    })

    if(!blogCatagory){
        return next(new CustomError(500, "Failed to create blog category"));
    }

    res.status(201).json({
        success: true,
        message: "Blog category created successfully",
        blogCatagory
    })
    
    
})