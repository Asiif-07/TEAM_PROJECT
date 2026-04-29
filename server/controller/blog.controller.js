import AsyncHandler from "../handler/AsyncHandler.js";
import User from "../model/user.model.js";
import CustomError from "../handler/CustomError.js";
import Blog from "../model/BlogModel.js";


const createBlog = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;

    const { title, description, coverImage, image, author, category, tags, status } = req.body;

    const user = await User.findById(userId);

    if(!user){
        throw new CustomError(404, 'User not found');
    }

    const blog = await Blog.create({
        userId,
        title,
        description,
        coverImage,
        image,
        author:userId,
        category,
        tags,
        status
    })

    await blog.populate('author', 'name email')
    await blog.populate('category', 'name')

    res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        blog
    })
});

const updateBlog = AsyncHandler(async(req,res,next)=>{
    const userId = req.userId;
    const {id} = req.params; 

    const blog = await Blog.findById(id);

    if(!blog){
        throw new CustomError(404, 'Blog not found');
    }

    if (blog.author.toString() !== userId.toString()) {
        throw new CustomError(403, 'you can update your own blog only');
    }

    blog = await Blog.findByIdAndUpdate(
        id,
        {...req.body},
        {
            new:true,
            runValidators:true
        }
    )

    await blog.populate('author', 'name email')
    await blog.populate('category', 'name')

    res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        blog
    })


})


const qdeleteBlog = AsyncHandler(async (req, res, next) => {
    const { id } = req.params; 
    const userId = req.userId; 

   
    const blog = await Blog.findById(id);

    
    if (!blog) {
        throw new CustomError(404, 'Blog not found ya pehle hi delete ho chuka hai');
    }

    
    if (blog.author.toString() !== userId.toString()) {
        throw new CustomError(403, 'Aap kisi aur ka blog delete nahi kar sakte!');
    }


    await blog.deleteOne(); 


    res.status(200).json({
        success: true,
        message: 'Blog successfully delete ho gaya hai'
    });
});


// const getAllBloges = AsyncHandler(async(req,res,next)=>{
    
// })


export { createBlog, updateBlog, deleteBlog }