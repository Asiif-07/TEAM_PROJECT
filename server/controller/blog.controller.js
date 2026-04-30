import AsyncHandler from "../handler/AsyncHandler.js";
import User from "../model/user.model.js";
import CustomError from "../handler/CustomError.js";
import Blog from "../model/BlogModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

const createBlog = AsyncHandler(async (req, res, next) => {
  const userId = req.userId;
 
  const { title, description, author, category, tags, status } = req.body;
 
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError(404, "User not found");
  }
 
  // ✅ Cover image upload
  let coverImageUrl = null;
  if (req.files && req.files.coverImage) {
    const result = await uploadToCloudinary({
      resource_type: "image",
      folder: "blogs/covers",
      buffer: req.files.coverImage[0].buffer,
    });
    coverImageUrl = result.secure_url;
  }
 
  // ✅ Multiple images upload
  let imageUrls = [];
  if (req.files && req.files.image) {
    const uploadPromises = req.files.image.map((file) =>
      uploadToCloudinary({
        resource_type: "image",
        folder: "blogs/images",
        buffer: file.buffer,
      })
    );
    const results = await Promise.all(uploadPromises);
    imageUrls = results.map((result) => result.secure_url);
  }
 
  const blog = await Blog.create({
    title,
    description,
    coverImage: coverImageUrl,
    image: imageUrls,
    author: userId,
    category,
    tags,   // ✅ FIX: model mein bhi 'tags' fix kiya (BlogModel.js dekho)
    status,
  });
 
  await blog.populate("author", "name email");
  await blog.populate("category", "name");
 
  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

const updateBlog = AsyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.params;
 
  const existingBlog = await Blog.findById(id);
  if (!existingBlog) {
    throw new CustomError(404, "Blog not found");
  }
 
  if (existingBlog.author.toString() !== userId.toString()) {
    throw new CustomError(403, "You can update your own blog only");
  }
 
  let updateData = { ...req.body };
 
  // ✅ Cover image update
  if (req.files && req.files.coverImage) {
    const result = await uploadToCloudinary({
      resource_type: "image",
      folder: "blogs/covers",
      buffer: req.files.coverImage[0].buffer,
    });
    updateData.coverImage = result.secure_url;
  }
 
  // ✅ Multiple images update
  if (req.files && req.files.image) {
    const uploadPromises = req.files.image.map((file) =>
      uploadToCloudinary({
        resource_type: "image",
        folder: "blogs/images",
        buffer: file.buffer,
      })
    );
    const results = await Promise.all(uploadPromises);
    updateData.image = results.map((result) => result.secure_url);
  }
 
  const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
 
  await updatedBlog.populate("author", "name email");
  await updatedBlog.populate("category", "name");
 
  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog: updatedBlog,
  });
});

const deleteBlog = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new CustomError(404, "No blog found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new CustomError(403, "you can not delete this blog");
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blog successfully deleted",
  });
});

const getAllBlogs = AsyncHandler(async (req, res, next) => {
  const queryStr = req.query;
  const allowedFields = ["category", "status", "tags", "author"];

  const blogQueryObj = new ApiFeatures(
    Blog.find().populate("category", "name").populate("author", "name email"),
    queryStr,
    allowedFields,
  )
    .filter()
    .search()
    .sort()
    .paginate();

  const blogs = await blogQueryObj.query;

  res.status(200).json({
    total: blogs.length,
    success: true,
    blogs,
  });
});

const getSingleBlog = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id)
    .populate("category", "name")
    .populate("author", "name email");

  if (!blog) {
    throw new CustomError(404, "Blog nahi mila ya delete ho chuka hai");
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

export { createBlog, updateBlog, deleteBlog, getAllBlogs, getSingleBlog };
