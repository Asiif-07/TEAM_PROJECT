import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/CustomError.js";
import User from "../model/user.model.js";
import BlogCatogery from "../model/blogCatagoryModle.js";

const createBlogCategory = AsyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { name, description } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new CustomError(404, "User not found"));
  }

  const category = await BlogCatogery.create({
    name,
    description,
    user: userId,
  });

  if (!category) {
    return next(new CustomError(500, "Failed to create blog category"));
  }

  res.status(201).json({
    success: true,
    message: "Blog category created successfully",
    category,
  });
});

const updateBlogCategory = AsyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.params;

  const category = await blogCatagory.findById(id);

  if (!category) {
    return next(new CustomError(404, "Blog category not found"));
  }

  if (category.userId.toString() !== userId) {
    return next(
      new CustomError(
        403,
        "You are not authorized to update this blog category",
      ),
    );
  }

  const updatedCategory = await blogCatagory.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Blog category updated successfully",
    updatedCategory,
  });
});


const getBlogCategorys = AsyncHandler(async (req, res, next) => {
  const queryStr = req.query;

  const allowedFields = ["name", "slug", "user"];

  const categoryQueryObj = new ApiFeatures(
    BlogCatogery.find().populate("user", "name email"),
    queryStr,
    allowedFields
  )
    .filter()
    .search()
    .sort()
    .paginate();

  const categories = await categoryQueryObj.query;

  res.status(200).json({
    success: true,
    total: categories.length,
    categories,
  });
});

export { createBlogCategory, updateBlogCategory, getBlogCategorys };
