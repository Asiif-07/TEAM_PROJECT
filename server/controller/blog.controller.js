import Post from "../model/post.model.js";
import Comment from "../model/comment.model.js";
import Category from "../model/category.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { createNotification } from "./notification_controller.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')    // Remove all non-word chars
        .replace(/--+/g, '-');      // Replace multiple - with single -
};

export const getPosts = async (req, res) => {
    try {
        const { category, search, author, page = 1, limit = 10 } = req.query;
        const query = {};

        if (category && category !== "All") query.category = category;
        if (author) query.author = author;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        const posts = await Post.find(query)
            .populate({
                path: "author",
                select: "name profileImage",
                populate: { path: "blogProfile" }
            })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments(query);

        const postsWithEngagement = posts.map(post => {
            const postObj = post.toJSON();
            return {
                ...postObj,
                likes: Array.from(post.reactions?.keys() || []),
                likeCount: post.reactions?.size || 0
            };
        });

        res.status(200).json({
            posts: postsWithEngagement,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate({
                path: "author",
                select: "name profileImage",
                populate: { path: "blogProfile" }
            })
            .exec();

        if (!post) return res.status(404).json({ message: "Post not found" });

        // Increment views
        post.views += 1;
        await post.save();

        const postObj = post.toJSON();
        const response = {
            ...postObj,
            likes: Array.from(post.reactions?.keys() || []),
            likeCount: post.reactions?.size || 0
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const author = req.user._id;

        let coverImage = {};
        if (req.files && req.files.coverImage) {
            const result = await uploadToCloudinary({
                buffer: req.files.coverImage[0].buffer,
                folder: "blog/covers"
            });
            coverImage = { secure_url: result.secure_url, public_id: result.public_id };
        }

        const bodyImages = [];
        if (req.files && req.files.bodyImages) {
            for (const file of req.files.bodyImages) {
                const result = await uploadToCloudinary({
                    buffer: file.buffer,
                    folder: "blog/body"
                });
                bodyImages.push({ secure_url: result.secure_url, public_id: result.public_id });
            }
        }

        const slug = slugify(title) + "-" + Date.now();

        const newPost = await Post.create({
            title,
            slug,
            content,
            author,
            category,
            coverImage,
            bodyImages
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user._id.toString();

        if (post.reactions.has(userId)) {
            post.reactions.delete(userId);
        } else {
            post.reactions.set(userId, true);
            
            // Notify the post author
            await createNotification({
                recipient: post.author,
                sender: userId,
                type: "like",
                post: post._id
            });
        }

        await post.save();
        res.status(200).json({ 
            likes: Array.from(post.reactions.keys()),
            likeCount: post.reactions.size 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { content, parentCommentId } = req.body;
        const postId = req.params.postId;
        const author = req.user._id;

        const comment = await Comment.create({
            content,
            author,
            post: postId,
            parentComment: parentCommentId || null
        });

        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (parent) {
                parent.replies.push(comment._id);
                await parent.save();

                // Notify parent comment author via socket
                await createNotification({
                    recipient: parent.author,
                    sender: author,
                    type: "reply",
                    post: postId,
                    comment: comment._id
                });
            }
        } else {
            // Top-level comment — notify the post author
            const post = await Post.findById(postId);
            if (post) {
                await createNotification({
                    recipient: post.author,
                    sender: author,
                    type: "reply",
                    post: postId,
                    comment: comment._id
                });
            }
        }

        const populatedComment = await Comment.findById(comment._id).populate("author", "name profileImage");

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (title) {
            post.title = title;
            // Optionally update slug if needed, but usually better to keep it
        }
        if (content) post.content = content;
        if (category) post.category = category;

        if (req.files && req.files.coverImage) {
            // Delete old cover image logic can be added here
            const result = await uploadToCloudinary({
                buffer: req.files.coverImage[0].buffer,
                folder: "blog/covers"
            });
            post.coverImage = { secure_url: result.secure_url, public_id: result.public_id };
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Delete from DB (Cloudinary deletion can be added here)
        await Post.findByIdAndDelete(req.params.id);
        
        // Also delete comments
        await Comment.deleteMany({ post: req.params.id });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId, parentComment: null })
            .populate("author", "name profileImage")
            .populate({
                path: "replies",
                populate: { path: "author", select: "name profileImage" }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Only author can delete
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Also remove from parent's replies if it's a child
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id }
            });
        }

        // Delete all child replies too
        if (comment.replies?.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
